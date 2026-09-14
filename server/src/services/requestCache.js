const inFlightRequests = new Map();

export async function dedupeRequest(key, requestFn) {
  const existingRequest = inFlightRequests.get(key);

  if (existingRequest) {
    return existingRequest;
  }

  const request = Promise.resolve()
    .then(requestFn)
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, request);

  return request;
}