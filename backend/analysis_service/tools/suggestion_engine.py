from agents import Agent, GuardrailFunctionOutput, RunContextWrapper, output_guardrail
from ..prompts import SUGGESTION_ENGINE_PROMPT
from ..models import ImprovementSuggestionsSchema
from typing import Any
from pydantic import ValidationError


@output_guardrail
def validate_output(ctx: RunContextWrapper, agent, agent_output: Any) -> GuardrailFunctionOutput:
    try:
        if isinstance(agent_output, dict):
            validated = ImprovementSuggestionsSchema.model_validate(agent_output)

        elif isinstance(agent_output, ImprovementSuggestionsSchema):
            validated = ImprovementSuggestionsSchema.model_validate(agent_output.model_dump())

        else:
            validated = ImprovementSuggestionsSchema.model_validate(dict(agent_output))

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
    name="Advisor Agent",
    model="gpt-4o-mini",
    instructions=SUGGESTION_ENGINE_PROMPT,
    output_type=ImprovementSuggestionsSchema,
    output_guardrails=[validate_output],
)


