import { Request, Response } from "express";
import { pool } from "../config/database";
import { Client } from "../models/client";
import {hashService} from "../core/services/hashService";

export const gelAllClients = async (_: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM clients ORDER BY name ASC");
  res.json(result.rows);
};

export const newClient = async (req: Request, res: Response) => {
  const { name, phone }: Client = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Nome e telefone são obrigatórios" });
  }

  try {
    const hashedName = await hashService.hash(name);
    const hashedPhone = await hashService.hash(phone);
    await pool.query("INSERT INTO clients (name, phone) VALUES ($1, $2)", [
      hashedName,
      hashedPhone,
    ]);
    res.status(201).json({ message: "Cliente cadastrado!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
};
