import { Request, Response } from "express";
import { pool } from "../config/database";

export const newScheduling = async (req: Request, res: Response) => {
  const { id_client, id_service, data_agendamento, id_hora } = req.body;

  if (!id_client || id_service || !data_agendamento || !id_hora) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    await pool.query(
      "INSERT INTO tb_agendamentos (client_id, servico_id, data_agendamento, hora_id ) VALUES ($1, $2, $3, $4)",
      [id_client, id_service, data_agendamento, id_hora]
    );
    res.status(201).json({ message: "Serviço agendado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao agendar: \n" + error });
  }
};
export const getAllScheduling = async (_: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM tb_agendamentos ORDER BY data_agendamento ASC"
  );
  res.json(result.rows);
};

export const getSchedulingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM tb_agendamentos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor", erro: error });
  }
};

export const updateScheduling = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_client, id_service, data_agendamento, id_hora } = req.body;

  if (!id_client || id_service || !data_agendamento || !id_hora || !id) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    const result = await pool.query(
      `UPDATE tb_agendamentos 
       SET client_id = $1, servico_id = $2, data_agendamento = $3, hora_id = $4
       WHERE id = $5
       RETURNING *`,
      [id_client, id_service, data_agendamento, id_hora, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.json({
      message: "Serviço atualizado com sucesso",
      service: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor", erro: error });
  }
};

export const deleteScheduling = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tb_agendamentos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    res.json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor", erro: error });
  }
};
