import asyncio
from pathlib import Path

from . import config
from .orchestrator import JDResumeOrchestrator

BASE_DIR = Path(__file__).resolve().parent

async def main():
    resume_path = BASE_DIR / "test" / "resume.pdf"
    jd_path = BASE_DIR / "test" / "jd.txt"

    if not resume_path.exists():
        raise FileNotFoundError(f"Resume file not found: {resume_path}")

    if not jd_path.exists():
        raise FileNotFoundError(f"JD file not found: {jd_path}")

    # Read JD text
    jd_text = jd_path.read_text(encoding="utf-8")

    orchestrator = JDResumeOrchestrator()

    try:
        result = await orchestrator.run(
            resume_path=str(resume_path),
            jd_text=jd_text
        )
    except Exception as e:
        print(f"\n❌ Pipeline failed: {e}")
        return

    # Pretty output
    print("\n==================== MATCH SUMMARY ====================")
    print(f"Match Percentage: {result.match.match_percent}%")
    print(f"Matched Skills: {result.match.matched_skills}")
    print(f"Missing Skills: {result.match.missing_skills}")

    print("\n================ IMPROVEMENT SUGGESTIONS ================")
    print(f"Skills to Learn: {result.suggestions.skills_to_learn}")
    print(f"Recommended Certifications: {result.suggestions.recommended_certifications}")
    print(f"Suggested Projects: {result.suggestions.suggested_projects}")
    print(f"Resume Line Improvements: {result.suggestions.resume_line_improvements}")
    print(f"Section Feedback: {result.suggestions.section_level_feedback}")

    print("\n================ FULL PIPELINE COMPLETE =================\n")


if __name__ == "__main__":
    asyncio.run(main())
