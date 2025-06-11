export const delayFunc = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
