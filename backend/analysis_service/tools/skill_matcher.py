from typing import Set, Any
from ..models import ResumeSchema, JDSchema, SkillMatchSchema
from pydantic import ValidationError
from agents import Agent, output_guardrail, RunContextWrapper, GuardrailFunctionOutput



def _normalize_list(items):
    return set(i.strip().lower() for i in items if i and isinstance(i, str))


def evaluate_skill_match(
    resume: ResumeSchema,
    jd: JDSchema
) -> SkillMatchSchema:
    """
    Deterministic skill evaluation engine.
    No LLM usage.
    """

    # Normalize core lists
    resume_skills: Set[str] = _normalize_list(resume.skills)
    jd_skills: Set[str] = _normalize_list(jd.keywords_to_focus_on)

    # Core overlap
    matched_skills = sorted(resume_skills & jd_skills)
    missing_skills = sorted(jd_skills - resume_skills)
    extra_skills = sorted(resume_skills - jd_skills)

    # Certifications relevance
    certification_text = resume.certifications.lower() if resume.certifications else ""
    certification_relevant = sorted(
        [skill for skill in jd_skills if skill in certification_text]
    )

    # Experience relevance (summary-based keyword presence)
    experience_text = resume.experience_summary.lower() if resume.experience_summary else ""
    experience_relevant = sorted(
        [skill for skill in jd_skills if skill in experience_text]
    )

    # Match percentage based strictly on JD requirements
    if len(jd_skills) == 0:
        match_percent = 0.0
    else:
        match_percent = round((len(matched_skills) / len(jd_skills)) * 100, 2)

    return SkillMatchSchema(
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        extra_skills_not_in_jd=extra_skills,
        certification_relevant_to_jd_skills=certification_relevant,
        experience_relevant_to_jd_skills=experience_relevant,
        match_percent=match_percent,
    )
