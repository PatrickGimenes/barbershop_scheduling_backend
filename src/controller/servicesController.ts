import { Request, Response } from "express";
import { pool } from "../config/database";
import { Service } from "../models/service";

export const getAllServices = async (_: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM tb_services ORDER BY nome ASC"
  );
  res.json(result.rows);
};


export const newService = async (req: Request, res: Response) => {
  const { name, value, description, icon }: Service = req.body;

  if (!name || !value || !description || !icon) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {

    await pool.query(
      "INSERT INTO tb_services (nome, valor, descricao, icon ) VALUES ($1, $2, $3. $4)",
      [name, value, description, icon]
    );
    res.status(201).json({ message: "Serviço cadastrado!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar serviço: \n" + error });
  }
};