import { Request, Response } from "express";
import { pool } from "../config/database";
import { Client } from "../types/client";
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

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tb_clientes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.json({ message: "Serviço excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor", erro: error });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM tb_clientes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor", erro: error });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone, pwd }: Client = req.body;

  if (!name || !phone || !pwd || !id) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    const hashedpwd = await hashService.hash(pwd);
    const result = await pool.query(
      `UPDATE tb_clientes
       SET
       SET nome = $1, telefone = $2, senha_hash = $3 
       WHERE id = $4 
       RETURNING *`,
      [name, phone, hashedpwd, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    res.json({
      message: "Cliente atualizado com sucesso",
      service: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor", erro: error });
  }
};
