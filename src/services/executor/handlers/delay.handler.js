export const runDelay = async (payload = {}) => {
  const ms = Number(payload.ms ?? 0);

  await new Promise((resolve) => setTimeout(resolve, ms));

  return {
    success: true,
    output: `Delayed for ${ms} ms`,
    error: null,
  };
};
