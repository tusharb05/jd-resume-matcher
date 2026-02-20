from agents import Runner
import json
from .tools.extract_resume import extract_resume_text
from .tools.parse_resume import agent as resume_parser_agent
from .tools.parse_jd import jd_parser_agent
from .tools.skill_matcher import evaluate_skill_match
from .tools.suggestion_engine import agent as suggestion_agent

from .models import (
    ResumeSchema,
    JDSchema,
    SkillMatchSchema,
    ImprovementSuggestionsSchema,
    FullEvaluationSchema
)


class JDResumeOrchestrator:

    async def run(
        self,
        resume_path: str,
        jd_text: str
    ) -> FullEvaluationSchema:
        """
        Executes full evaluation pipeline:
        1. Extract resume text
        2. Parse resume
        3. Parse JD
        4. Compute deterministic match
        5. Generate improvement suggestions
        """

        if not jd_text or not jd_text.strip():
            raise ValueError("JD text cannot be empty.")

 
 
        resume_text: str = await extract_resume_text(resume_path)

        if not resume_text or len(resume_text.strip()) < 50:
            raise ValueError("Resume text extraction failed or resume too short.")


    
        resume_result = await Runner.run(resume_parser_agent, resume_text, max_turns=2)
        resume_structured: ResumeSchema = resume_result.final_output


      
        jd_result = await Runner.run(jd_parser_agent, jd_text, max_turns=2)
        jd_structured: JDSchema = jd_result.final_output


        if not jd_structured.keywords_to_focus_on:
            raise ValueError("JD parsing failed: No keywords extracted.")


     
        match_result: SkillMatchSchema = evaluate_skill_match(
            resume_structured,
            jd_structured
        )

      
        suggestion_payload = {
            "resume": resume_structured.model_dump(),
            "resume_raw_text": resume_text,
            "jd": jd_structured.model_dump(),
            "match": match_result.model_dump()
        }

        suggestion_input = json.dumps(suggestion_payload, indent=2)
        suggestion_result = await Runner.run(suggestion_agent, suggestion_input, max_turns=2)
        # suggestion_result = await Runner.run(suggestion_agent, suggestion_payload)
        suggestions: ImprovementSuggestionsSchema = suggestion_result.final_output


        return FullEvaluationSchema(
            resume=resume_structured,
            jd=jd_structured,
            match=match_result,
            suggestions=suggestions
        )
