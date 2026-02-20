import shutil
import tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from .orchestrator import JDResumeOrchestrator
from . import config

app = FastAPI(title="JD Resume Matcher")

orchestrator = JDResumeOrchestrator()


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """
    Accepts:
    - resume: PDF file
    - jd_text: job description text
    """

    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Resume must be a PDF")


    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            temp_path = Path(tmp.name)
            shutil.copyfileobj(resume.file, tmp)
       
        result = await orchestrator.run(
            resume_path=str(temp_path),
            jd_text=jd_text
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {e}")

    finally:
        
        if 'temp_path' in locals() and temp_path.exists():
            temp_path.unlink(missing_ok=True)

  
    return JSONResponse({
        "match_summary": {
            "match_percent": result.match.match_percent,
            "matched_skills": result.match.matched_skills,
            "missing_skills": result.match.missing_skills,
        },
        "improvement_suggestions": {
            "skills_to_learn": result.suggestions.skills_to_learn,
            "recommended_certifications": result.suggestions.recommended_certifications,
            "suggested_projects": result.suggestions.suggested_projects,
            "resume_line_improvements": result.suggestions.resume_line_improvements,
            "section_level_feedback": result.suggestions.section_level_feedback,
        }
    })
