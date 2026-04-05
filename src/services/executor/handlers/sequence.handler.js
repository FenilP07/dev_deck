export const runSequence = async (payload = {}, executeStep) => {
  const steps = Array.isArray(payload.steps) ? payload.steps : [];
  const stopOnFailure =
    typeof payload.stopOnFailure === "boolean" ? payload.stopOnFailure : true;

  const outputs = [];
  const errors = [];
  const stepResults = [];
  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    const startedAt = new Date().toISOString();
    const result = await executeStep(step);
    const endedAt = new Date().toISOString();

    const normalizedStepResult = {
      index,
      type: step.type,
      label: step.label || null,
      success: Boolean(result.success),
      output: result.output || null,
      error: result.error || null,
      meta: result.meta || null,
      startedAt,
      endedAt,
    };

    stepResults.push(normalizedStepResult);

    if (result.output) outputs.push(result.output);
    if (result.error) errors.push(result.error);

    if (!result.success && stopOnFailure) {
      return {
        success: false,
        outputs: outputs.join("\n") || null,
        error: errors.join("\n") || "Sequence failed",
        meta: {
          steps: stepResults,
          totalSteps: steps.length,
          completedSteps: stepResults.length,
          failedStepIndex: index,
        },
      };
    }
  }

  // for (const step of steps) {
  //   const result = await executeStep(step);

  //   if (result.output) outputs.push(result.output);
  //   if (result.error) errors.push(result.error);

  //   if (!result.success && stopOnFailure) {
  //     return {
  //       success: false,
  //       output: outputs.join("\n") || null,
  //       error: errors.join("\n") || "Sequence failed",
  //     };
  //   }
  // }

  return {
    success: true,
    output: outputs.join("\n") || "Sequence completed successfully",
    error: errors.length ? errors.join("\n") : null,
    meta: {
      steps: stepResults,
      totalSteps: steps.length,
      completedSteps: stepResults.length,
      failedStepIndex: null,
    },
  };
};
