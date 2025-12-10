import { Request, Response } from "express";
import { pool } from "../config/database";
import { Client } from "../models/client";
import { hashService } from "../core/services/hashService";

export const gelAllClients = async (_: Request, res: Response) => {
  const result = await pool.query(
    "SELECT nome, telefone FROM tb_clientes ORDER BY nome ASC"
  );
  res.json(result.rows);
};

export const newClient = async (req: Request, res: Response) => {
  const { name, phone, pwd }: Client = req.body;

  if (!name || !phone || !pwd) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    const hashedpwd = await hashService.hash(pwd);

    await pool.query(
      "INSERT INTO tb_clientes (nome, telefone, senha_hash ) VALUES ($1, $2, $3)",
      [name, phone, hashedpwd]
    );
    res.status(201).json({ message: "Cliente cadastrado!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar cliente: \n" + error });
  }
};

export const scheduling = async (_: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM tb_agendamentos ORDER BY data_agendamento ASC"
  );
  res.json(result.rows);
};
