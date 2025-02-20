test('rejects requests without tenantId', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    tenantResolver(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(401);
  });