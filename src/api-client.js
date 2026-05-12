/**
 * api-client.js
 * Builds the structured DispatchPayload and returns a mocked API response.
 */

export const postDispatchIntent = async (rawForm) => {
  console.log('[EMListen] Mock dispatch payload →', rawForm)

  await new Promise((resolve) => setTimeout(resolve, 300))

  const mockResponse = {
    status: 'ok',
    message: 'Mock dispatch accepted',
    payload: rawForm,
  }

  console.log('[EMListen] Mock gateway response:', mockResponse)
  return mockResponse
}
