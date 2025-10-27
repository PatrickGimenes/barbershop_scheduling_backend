import { Request, Response } from "express";
import { pool } from "../config/database";
import { Client } from "../models/client";

import { hashService } from "../core/services/hashService";

import { signAccessToken } from "../core/utils/jwtUtils";

export async function login(req: Request, res: Response) {
  const { phone, pwd }: Client = req.body;

  if (!phone || !pwd) return res.status(400).json({ error: "Dados inválidos" });

  const { rows } = await pool.query(
    "SELECT id, nome, senha_hash FROM tb_clientes WHERE telefone = $1",
    [phone]
  );

  const user = rows[0];

  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const match = await hashService.compare(pwd, user.senha_hash);

  if (!match) return res.status(401).json({ error: "Credenciais inválidas" });

  const accessToken = signAccessToken({ userId: user.id });

  res.json({
    accessToken,
    user: { id: user.id, nome: user.nome, phone },
  });
}
