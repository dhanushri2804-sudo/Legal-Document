from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
import dotenv
from fastapi import Depends, FastAPI, File, HTTPException, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from pydantic import BaseModel, field_validator
from sqlalchemy import func
from sqlalchemy.orm import Session
from docx import Document as DocxDocument
from fpdf import FPDF

from .database import Base, SessionLocal, engine, get_db
from .models import Document, User

dotenv.load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

app = FastAPI(title="LegalEase API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        if not value or len(value.strip()) < 2:
            raise ValueError("Name must be at least 2 characters long.")
        return value.strip()

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        if "@" not in value or "." not in value:
            raise ValueError("Please provide a valid email address.")
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return value


class LoginRequest(BaseModel):
    email: str
    password: str


class DocumentRequest(BaseModel):
    title: str
    document_type: str
    parties: str
    terms: str
    effective_date: str
    jurisdiction: str | None = None
    additional_instructions: str | None = None
    company_name: str | None = None
    logo_filename: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Document title is required.")
        return value.strip()

    @field_validator("document_type")
    @classmethod
    def validate_document_type(cls, value):
        if not value or len(value.strip()) < 2:
            raise ValueError("Please choose a valid document type.")
        return value.strip()

    @field_validator("parties")
    @classmethod
    def validate_parties(cls, value):
        if not value or len(value.strip()) < 3:
            raise ValueError("Parties involved is required.")
        return value.strip()

    @field_validator("terms")
    @classmethod
    def validate_terms(cls, value):
        if not value or len(value.strip()) < 20:
            raise ValueError("Terms and conditions must be at least 20 characters long.")
        return value.strip()

    @field_validator("effective_date")
    @classmethod
    def validate_effective_date(cls, value):
        if not value:
            raise ValueError("Effective date is required.")
        try:
            datetime.fromisoformat(value)
        except ValueError as exc:
            raise ValueError("Effective date must be a valid ISO date string.") from exc
        return value


class UpdateDocumentRequest(BaseModel):
    title: str | None = None
    document_type: str | None = None
    parties: str | None = None
    terms: str | None = None
    effective_date: str | None = None
    jurisdiction: str | None = None
    additional_instructions: str | None = None
    company_name: str | None = None
    content: str | None = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


class DocumentResponse(BaseModel):
    id: int
    title: str
    document_type: str
    parties: str
    terms: str
    effective_date: str
    jurisdiction: str | None
    additional_instructions: str | None
    company_name: str | None
    content: str
    created_at: str
    updated_at: str
    user_id: int


def create_access_token(data: dict):
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)], db: Session = Depends(get_db)) -> User:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token.") from exc

    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload.")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
    return user


def safe_document(item: Document) -> DocumentResponse:
    return DocumentResponse(
        id=item.id,
        title=item.title,
        document_type=item.document_type,
        parties=item.parties,
        terms=item.terms,
        effective_date=item.effective_date,
        jurisdiction=item.jurisdiction,
        additional_instructions=item.additional_instructions,
        company_name=item.company_name,
        content=item.content,
        created_at=item.created_at.isoformat(),
        updated_at=item.updated_at.isoformat(),
        user_id=item.user_id,
    )


def generate_fallback_document(document: DocumentRequest) -> str:
    company = document.company_name or "Your Company"
    salutations = "This draft is prepared for informational use and should be reviewed by legal counsel before execution."
    return f"{document.title}\n\nDocument Type: {document.document_type}\nEffective Date: {document.effective_date}\nJurisdiction: {document.jurisdiction or 'Not specified'}\n\nParties: {document.parties}\nCompany Name: {company}\n\nTerms and Conditions:\n{document.terms}\n\nAdditional Instructions:\n{document.additional_instructions or 'No additional instructions provided.'}\n\n{salutations}\n\nPrepared by LegalEase AI."


def generate_document_text(document: DocumentRequest) -> str:
    try:
        import google.generativeai as genai
    except ImportError:
        return generate_fallback_document(document)

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return generate_fallback_document(document)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "You are a professional legal drafting assistant. Generate a polished, clear legal document draft "
            f"based on the following inputs. Keep the tone formal and legally accurate, and include headings. "
            f"Document Type: {document.document_type}\nTitle: {document.title}\nParties: {document.parties}\n"
            f"Effective Date: {document.effective_date}\nJurisdiction: {document.jurisdiction or 'Not specified'}\n"
            f"Company Name: {document.company_name or 'Not specified'}\nTerms and Conditions: {document.terms}\n"
            f"Additional Instructions: {document.additional_instructions or 'None'}"
        )
        response = model.generate_content(prompt)
        text = getattr(response, "text", None)
        if text:
            return text
    except Exception:
        pass
    return generate_fallback_document(document)


def export_document_pdf(content: str, title: str) -> bytes:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 12, txt=title, ln=1)
    pdf.set_font("Helvetica", "", 11)
    for line in content.splitlines():
        pdf.multi_cell(0, 10, txt=line)
    return pdf.output(dest="S")


def export_document_docx(content: str, title: str) -> bytes:
    doc = DocxDocument()
    doc.add_heading(title, level=1)
    for paragraph in content.splitlines():
        doc.add_paragraph(paragraph)
    buffer = __import__("io").BytesIO()
    doc.save(buffer)
    return buffer.getvalue()


def export_document_txt(content: str, title: str) -> str:
    return f"{title}\n\n{content}"


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "LegalEase backend is running"}


@app.post("/api/auth/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    user = User(name=request.name, email=request.email, password_hash=get_password_hash(request.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}


@app.post("/api/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email.lower().strip()).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    token = create_access_token({"sub": str(user.id)})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}


@app.get("/api/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}


@app.get("/api/dashboard")
def dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_documents = db.query(func.count(Document.id)).filter(Document.user_id == current_user.id).scalar() or 0
    recent_documents = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).limit(5).all()
    stats = db.query(Document.document_type, func.count(Document.id).label("count")).filter(Document.user_id == current_user.id).group_by(Document.document_type).all()

    return {
        "welcome": f"Welcome back, {current_user.name.split()[0]}!",
        "total_documents": total_documents,
        "recent_documents": [
            {
                "id": item.id,
                "title": item.title,
                "document_type": item.document_type,
                "created_at": item.created_at.isoformat(),
            }
            for item in recent_documents
        ],
        "document_stats": [{"name": item[0], "count": item[1]} for item in stats],
    }


@app.get("/api/documents")
def get_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
    return [safe_document(item) for item in documents]


@app.get("/api/documents/{document_id}")
def get_document(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    return safe_document(document)


@app.post("/api/documents/generate")
def generate_document(request: DocumentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    generated_content = generate_document_text(request)
    document = Document(
        user_id=current_user.id,
        title=request.title,
        document_type=request.document_type,
        parties=request.parties,
        terms=request.terms,
        effective_date=request.effective_date,
        jurisdiction=request.jurisdiction,
        additional_instructions=request.additional_instructions,
        company_name=request.company_name,
        logo_filename=request.logo_filename,
        content=generated_content,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return {"message": "Document generated successfully.", "document": safe_document(document)}


@app.put("/api/documents/{document_id}")
def update_document(document_id: int, request: UpdateDocumentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    for field, value in request.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(document, field, value)
    document.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(document)
    return {"message": "Document updated successfully.", "document": safe_document(document)}


@app.delete("/api/documents/{document_id}")
def delete_document(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully."}


@app.get("/api/documents/{document_id}/download")
def download_document(document_id: int, format: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    normalized_format = format.lower()
    if normalized_format == "pdf":
        contents = export_document_pdf(document.content, document.title)
        return Response(contents, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{document.title}.pdf"'})
    if normalized_format == "docx":
        contents = export_document_docx(document.content, document.title)
        return Response(contents, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={"Content-Disposition": f'attachment; filename="{document.title}.docx"'})
    if normalized_format == "txt":
        content = export_document_txt(document.content, document.title)
        return Response(content.encode("utf-8"), media_type="text/plain", headers={"Content-Disposition": f'attachment; filename="{document.title}.txt"'})

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported format. Use pdf, docx, or txt.")


@app.post("/api/documents/{document_id}/upload-logo")
def upload_logo(document_id: int, file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    if file and file.filename:
        document.logo_filename = file.filename
        db.commit()
        return {"message": "Logo uploaded successfully.", "filename": file.filename}
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A valid file is required.")
