import re
import pdfplumber


async def extract_resume_text(file_path: str) -> str:
    """
    Extracts and cleans raw text from a resume PDF.
    No parsing. No structuring. Just deterministic text extraction.
    """
    print(file_path)
    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    # Normalize whitespace
    text = re.sub(r'\s+\n', '\n', text)
    text = re.sub(r'\n{2,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)

    return text.strip()
