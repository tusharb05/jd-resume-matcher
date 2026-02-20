from agents import Agent, RunContextWrapper, GuardrailFunctionOutput, output_guardrail
from ..models import JDSchema
from ..prompts import JD_EXTRACTOR_PROMPT
from typing import Any
from pydantic import ValidationError

@output_guardrail
def validate_output(
        ctx: RunContextWrapper, 
        agent,
        agent_output: Any
    ) -> GuardrailFunctionOutput:
    """
    Ensures the agent output strictly conforms to JDSchema.
    If validation fails, the model is asked to regenerate.
    """

    try:
        if isinstance(agent_output, dict):
            validated = JDSchema.model_validate(agent_output)

        elif isinstance(agent_output, JDSchema):
            validated = JDSchema.model_validate(agent_output.model_dump())

        else:
            validated = JDSchema.model_validate(dict(agent_output))

        return GuardrailFunctionOutput(tripwire_triggered=False, output_info=None)
    
    except (ValidationError, TypeError, ValueError) as error:
        return GuardrailFunctionOutput(
            tripwire_triggered=True,
            output_info=(
                "Output did not match required schema. "
                "Ensure all fields are present with correct types and no extra text."
            )
        )


jd_parser_agent = Agent(
    name="JD Parser Agent",
    model="gpt-4o-mini",
    instructions=JD_EXTRACTOR_PROMPT,
    output_type=JDSchema,
    output_guardrails=[validate_output],
)

