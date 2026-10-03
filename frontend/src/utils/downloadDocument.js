import api from '../api';

const mimeTypes = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
};

export async function downloadDocumentFile(documentId, title, format) {
  try {
    const response = await api.get(`/documents/${documentId}/download?format=${format}`, { responseType: 'blob' });
    const data = response.data;
    if (!(data instanceof Blob) || data.size === 0) {
      throw new Error('The downloaded file is empty. Please save the document and try again.');
    }

    if (format === 'pdf' && (await data.slice(0, 5).text()) !== '%PDF-') {
      throw new Error('The server returned an invalid PDF. Please try again.');
    }
    if (format === 'docx') {
      const signature = new Uint8Array(await data.slice(0, 2).arrayBuffer());
      if (signature[0] !== 0x50 || signature[1] !== 0x4b) {
        throw new Error('The server returned an invalid DOCX file. Please try again.');
      }
    }

    const contentType = mimeTypes[format];
    const blob = new Blob([data], { type: contentType });
    const disposition = response.headers['content-disposition'] || '';
    const serverFilename = disposition.match(/filename="([^"]+)"/i)?.[1];
    const safeTitle = (title || 'document').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_');
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = serverFilename || `${safeTitle}.${format}`;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  } catch (error) {
    const responseData = error.response?.data;
    if (responseData instanceof Blob) {
      try {
        const payload = JSON.parse(await responseData.text());
        throw new Error(payload.detail || 'Unable to download this document.');
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw error;
        }
        throw parseError;
      }
    }
    throw error;
  }
}
