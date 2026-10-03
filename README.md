# LegalEase – AI-Powered Legal Document Generator

LegalEase is a full-stack web application for generating, editing, storing, and exporting legal document drafts using AI-assisted workflows.

## Features

- Premium SaaS-style homepage
- User registration and login with JWT authentication
- Protected dashboard and user profile routes
- AI-generated legal drafting with Gemini fallback logic
- Editable document workspace
- PDF, DOCX, and TXT exports
- Secure user-specific document storage
- Document Q&A and plain-English explanations, with Gemini when configured
- PDF/DOCX contract analysis, clause checks, and extracted date suggestions
- Searchable, categorized document templates
- Document version snapshots, comparison, and restore
- Signature status tracking and important-date reminders
- SQLite database for local development
- React + Vite frontend and FastAPI backend

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- JWT authentication
- Passlib + bcrypt
- python-dotenv
- google-generativeai
- python-docx
- pypdf
- FPDF

## Project Structure

```text
Legal Document/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── models.py
│   ├── .env.example
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package-lock.json
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── .vscode/
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Backend Setup

1. Open a terminal in the `backend` folder.
2. Create and activate a virtual environment if desired.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Copy the example environment file:

```bash
copy .env.example .env
```

5. Update `.env` with your values if needed:

```env
JWT_SECRET_KEY=your-secret-key
GOOGLE_API_KEY=your-gemini-api-key
```

6. Start the FastAPI server:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload
```

## Frontend Setup

1. Open a terminal in the `frontend` folder.
2. Install dependencies:

```bash
npm install
```

3. Copy the example env file if available:

```bash
copy .env.example .env
```

4. Start the Vite development server:

```bash
npm run dev
```

The app should be available at:

- Frontend: http://127.0.0.1:5173
- Backend API: http://127.0.0.1:8002

## Default API Base URL

The frontend uses:

```text
http://localhost:8002/api
```

If needed, update the Vite environment variable:

```env
VITE_API_URL=http://localhost:8002/api
```

## Authentication

Users can create an account via `/register`, log in via `/login`, and access protected pages after successful authentication. Passwords are never stored in plain text—they are hashed with bcrypt.

## Document Workflow

1. Select a document type or enter custom details.
2. Submit the generation form.
3. The backend validates the request and creates a draft.
4. The generated content appears in the editor.
5. Users can edit and save changes.
6. Files can be exported as PDF, DOCX, or TXT.

## Legal Workspace Tools

Authenticated users can open the Legal Assistant to ask questions about saved drafts. When `GOOGLE_API_KEY` is configured, the assistant and contract analyzer use Gemini; without it, the assistant uses limited local text matching and the analyzer reports local checks. The analyzer accepts text-based PDF and DOCX files up to 10 MB, extracts common clause references and recognizable dates, and does not retain uploaded files. Scanned PDFs require OCR, which is not currently included.

The Template Library offers searchable starting points that populate the document form for customization. The editor stores a snapshot of the previous title and content whenever a change is saved and supports comparing or restoring snapshots. Signature requests are a manual status tracker only: LegalEase does not send email, collect signatures, or certify legally binding e-signatures. Reminders are stored per user and can be linked to a document; dates found in analyzer results can be added to the reminder list.

Automated summaries and reviews can miss context and are not legal advice. Have important agreements reviewed by a qualified lawyer, particularly for jurisdiction-specific requirements.

## Notes

- If the Gemini API key is missing or the external request fails, the application falls back to a local generated draft so the app remains usable.
- This project uses SQLite by default for easy local development.

## License

This project is for demonstration and development purposes.
