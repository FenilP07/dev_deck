export const runSequence = async (payload = {}, executeStep) => {
  const steps = Array.isArray(payload.steps) ? payload.steps : [];
  const stopOnFailure =
    typeof payload.stopOnFailure === "boolean" ? payload.stopOnFailure : true;

  const outputs = [];
  const errors = [];

  for (const step of steps) {
    const result = await executeStep(step);

    if (result.output) outputs.push(result.output);
    if (result.error) errors.push(result.error);

    if (!result.success && stopOnFailure) {
      return {
        success: false,
        output: outputs.join("\n") || null,
        error: errors.join("\n") || "Sequence failed",
      };
    }
  }

  return {
    success: true,
    output: outputs.join("\n") || "Sequence completed successfully",
    error: errors.length ? errors.join("\n") : null,
  };
};
