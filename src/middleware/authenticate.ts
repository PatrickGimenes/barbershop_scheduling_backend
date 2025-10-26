import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../core/utils/jwtUtils';
import { error } from 'console';

export function authenticate(req: Request, res: Response, next:NextFunction){
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).json({error: 'Token ausente'});

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).json({error: 'Formato inválido'});

    const token: string = parts[1] as string;

    try{
        const payload = verifyAccessToken(token) as any;
        (req as any).userId = payload.userId;
        next();

    }catch(error){
        return res.status(401).json({
            msg: 'Token inválido',
            error: error
        })
    }
}


