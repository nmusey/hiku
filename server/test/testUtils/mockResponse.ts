export const mockResponse = {
    headers: {} as Record<string, string>,
    getHeader: (key: string) => mockResponse.headers[key],
    setHeader: (key: string, value: string) => mockResponse.headers[key] = value,

    send: () => {},

    lastStatus: 200,
    status: (newStatus: number) => {
        mockResponse.lastStatus = newStatus;
        return mockResponse;
    }
};