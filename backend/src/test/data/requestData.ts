// src/tests/data/requestData.ts
export const mockRequest = (host: string, tenant?: any) => ({
    headers: {
      host,
    },
    tenant,
    context: {},
  });
  
  export const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  export const mockNext = jest.fn();