from agents import Agent, RunContextWrapper, GuardrailFunctionOutput, output_guardrail
from ..models import ResumeSchema
from ..prompts import RESUME_PARSER_PROMPT
from typing import Any
from pydantic import ValidationError

@output_guardrail
def validate_output(ctx: RunContextWrapper, agent, agent_output: Any) -> GuardrailFunctionOutput:
    try:
        if isinstance(agent_output, dict):
            validated = ResumeSchema.model_validate(agent_output)

        elif isinstance(agent_output, ResumeSchema):
            validated = ResumeSchema.model_validate(agent_output.model_dump())

        else:
            validated = ResumeSchema.model_validate(dict(agent_output))

        return GuardrailFunctionOutput(tripwire_triggered=False, output_info=None)

    except (ValidationError, ValueError, TypeError) as error:
        return GuardrailFunctionOutput(
            tripwire_triggered=True,
            output_info=(
                "Output did not match required schema. "
                "Ensure all fields are present with correct types and no extra text."
            )
        )
    

agent = Agent(
    name="Resume Parser Agent",
    model="gpt-4o-mini",
    instructions=RESUME_PARSER_PROMPT,
    output_type=ResumeSchema,
    output_guardrails=[validate_output],
)
