from pydantic import BaseModel
from typing import List

class JDSchema(BaseModel):
    title: str
    requirements: str
    experience_required: str
    domain_focus: str
    keywords_to_focus_on: List[str]
    role: str
    experience: str


class ResumeSchema(BaseModel):
    name: str
    skills: List[str]
    years_of_experience: str
    projects: List[str]
    experience_summary: str
    education: str
    certifications: str


class SkillMatchSchema(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    extra_skills_not_in_jd: List[str]
    certification_relevant_to_jd_skills: List[str]
    experience_relevant_to_jd_skills: List[str]
    match_percent: float


class ImprovementSuggestionsSchema(BaseModel):
    skills_to_learn: List[str]
    recommended_certifications: List[str]
    suggested_projects: List[str]
    resume_line_improvements: List[str]
    section_level_feedback: List[str]


class FullEvaluationSchema(BaseModel):
    resume: ResumeSchema
    jd: JDSchema
    match: SkillMatchSchema
    suggestions: ImprovementSuggestionsSchema
