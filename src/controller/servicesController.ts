import { Request, Response } from "express";
import { pool } from "../config/database";
import { Service } from "../types/service";
import * as serviceService from "../services/serviceService";

export const getAllServices = async (_: Request, res: Response) => {
  try {
    const services = await serviceService.getAllServices();
    return res.json(services);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const newService = async (req: Request, res: Response) => {
  const { name, value, description, icon }: Service = req.body;

  if (!name || !value || !description || !icon) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    await serviceService.newService({ name, value, description, icon });
    return res.status(201).json({ message: "Serviço cadastrado!" });
  } catch (error: any) {
    return res.status(500).json({
      error: "Erro ao cadastrar serviço",
      details: error.message,
    });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório" });
  }

  try {
    const service = await serviceService.getServiceById(id);

    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    return res.json(service);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Erro interno no servidor",
      erro: error.message,
    });
  }
};

export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, valor, descricao } = req.body;
  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório" });
  }

  try {
    const updated = await serviceService.updateService(
      id,
      nome,
      valor,
      descricao
    );

    if (!updated) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    return res.json({
      message: "Serviço atualizado com sucesso",
      service: updated,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Erro interno no servidor",
      erro: error.message,
    });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório" });
  }

  try {
    const deleted = await serviceService.deleteService(id);

    if (!deleted) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    return res.json({ message: "Serviço excluído com sucesso" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Erro interno no servidor",
      erro: error.message,
    });
  }
};
