// src/renderer/api-service.test.js

const apiService = require('./api-service');

describe('apiService', () => {
  const mockFetch = jest.fn();
  const API_BASE_URL = 'http://localhost:3001/ask';
  const MOCK_CONFIG_RESPONSE = {
    ok: true,
    json: () => Promise.resolve({ apiBaseUrl: API_BASE_URL }),
  };

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    // Pas besoin de restaurer les mocks globaux si mockReset est utilisé
  });

  it('should send a message to the bot and return the response', async () => {
    const mockResponse = { answer: 'Hello from bot!', formattedResponse: {} };

    mockFetch.mockResolvedValueOnce(MOCK_CONFIG_RESPONSE) // Premier appel pour config.json
             .mockResolvedValueOnce({
               ok: true,
               json: () => Promise.resolve(mockResponse),
             }); // Deuxième appel pour l'API du bot

    const question = 'Hello';
    const data = await apiService.sendMessageToBot(question);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toEqual('../main/config.json');
    expect(mockFetch.mock.calls[0][1]).toBeUndefined();
    expect(mockFetch.mock.calls[1][0]).toEqual(API_BASE_URL);
    expect(mockFetch.mock.calls[1][1]).toEqual({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    expect(data).toEqual(mockResponse);
  });

  it('should throw an error if the API response is not ok', async () => {
    const errorText = 'Internal Server Error';
    mockFetch.mockResolvedValueOnce(MOCK_CONFIG_RESPONSE) // Premier appel pour config.json
             .mockResolvedValueOnce({
               ok: false,
               status: 500,
               text: () => Promise.resolve(errorText),
             }); // Deuxième appel pour l'API du bot

    const question = 'Error test';
    await expect(apiService.sendMessageToBot(question)).rejects.toThrow(
      `Erreur API: 500 - ${errorText}`
    );
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toEqual('../main/config.json');
    expect(mockFetch.mock.calls[0][1]).toBeUndefined();
    expect(mockFetch.mock.calls[1][0]).toEqual(API_BASE_URL);
    expect(mockFetch.mock.calls[1][1].method).toEqual('POST');
    expect(mockFetch.mock.calls[1][1].body).toEqual(JSON.stringify({ question }));
  });

  it('should return true if checkApiStatus is successful', async () => {
    mockFetch.mockResolvedValueOnce(MOCK_CONFIG_RESPONSE) // Premier appel pour config.json
             .mockResolvedValueOnce({
               ok: true,
             }); // Deuxième appel pour l'API du bot

    const isConnected = await apiService.checkApiStatus();
    expect(isConnected).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toEqual('../main/config.json');
    expect(mockFetch.mock.calls[0][1]).toBeUndefined();
    expect(mockFetch.mock.calls[1][0]).toEqual(API_BASE_URL);
    expect(mockFetch.mock.calls[1][1].method).toEqual('GET');
  });

  it('should return false if checkApiStatus fails', async () => {
    mockFetch.mockResolvedValueOnce(MOCK_CONFIG_RESPONSE) // Premier appel pour config.json
             .mockResolvedValueOnce({
               ok: false,
             }); // Deuxième appel pour l'API du bot

    const isConnected = await apiService.checkApiStatus();
    expect(isConnected).toBe(false);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0][0]).toEqual('../main/config.json');
    expect(mockFetch.mock.calls[0][1]).toBeUndefined();
    expect(mockFetch.mock.calls[1][0]).toEqual(API_BASE_URL);
    expect(mockFetch.mock.calls[1][1].method).toEqual('GET');
  });
}); 