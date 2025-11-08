CREATE TABLE tb_clientes (
id SERIAL PRIMARY KEY,
nome VARCHAR(50) NOT NULL,
telefone VARCHAR(19) NOT NULL,
senha_hash VARCHAR(65) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

select * from tb_clientes;