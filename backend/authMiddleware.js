/* global process */
import jwt from 'jsonwebtoken';

import { getJwtSecret } from './jwtSecret.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = decoded; // Contains id and role
        next();
    } catch (err) { // eslint-disable-line no-unused-vars
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Access denied. User not authenticated.' });
        }

        if (req.user.role !== role && req.user.role !== 'admin' && !(role === 'admin' && req.user.role === 'doctor')) {
            return res.status(403).json({ error: `Access denied. Requires ${role} role.` });
        }

        next();
    };
};
