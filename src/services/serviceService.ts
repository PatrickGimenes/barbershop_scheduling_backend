import { pool } from "../config/database";
import { Service } from "../types/service";

export const getAllServices = async () => {
  const result = await pool.query(
    "SELECT * FROM tb_services ORDER BY nome ASC"
  );
  return result.rows;
};

export const newService = async (service: Service) => {
  const { name, value, description, icon } = service;

  await pool.query(
    "INSERT INTO tb_services (nome, valor, descricao, icon) VALUES ($1, $2, $3, $4)",
    [name, value, description, icon]
  );
};

export const getServiceById = async (id: string) => {
  const result = await pool.query("SELECT * FROM tb_services WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
};

export const updateService = async (
  id: string,
  nome: string,
  valor: number,
  descricao: string
) => {
  const result = await pool.query(
    `UPDATE tb_services 
     SET nome = $1, valor = $2, descricao = $3 
     WHERE id = $4 
     RETURNING *`,
    [nome, valor, descricao, id]
  );

  return result.rows[0] || null;
};

export const deleteService = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM tb_services WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0] || null;
};
