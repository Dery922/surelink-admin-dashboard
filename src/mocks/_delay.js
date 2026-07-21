/** Simulate network latency so mock adapters exercise loading states. */
export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
