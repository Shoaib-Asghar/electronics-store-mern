import { jest } from '@jest/globals';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

describe('Auth Middleware', () => {
  it('should reject if no token', async () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should reject if not admin', () => {
    const req = { user: { role: 'customer' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call next if admin', () => {
    const req = { user: { role: 'admin' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    isAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should decode token and attach user', async () => {
    const token = jwt.sign({ userId: 'testid', role: 'admin' }, JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Mock User.findById to return an object with a .select() method
    const userMock = { _id: 'testid', role: 'admin' };
    const selectMock = jest.fn().mockResolvedValue(userMock);
    const findByIdMock = jest.spyOn(User, 'findById').mockReturnValue({ select: selectMock });

    await protect(req, res, next);

    expect(selectMock).toHaveBeenCalledWith('-password');
    expect(next).toHaveBeenCalled();

    findByIdMock.mockRestore();
  });
});