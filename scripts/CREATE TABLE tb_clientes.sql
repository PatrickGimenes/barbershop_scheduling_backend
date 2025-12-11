CREATE TABLE
    tb_clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        telefone VARCHAR(15) NOT NULL UNIQUE,
        senha_hash VARCHAR(65) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    tb_services (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        valor DECIMAL(7, 2) NOT NULL,
        descricao VARCHAR(65) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TYPE status_agendamento AS ENUM (
    'Agendado',
    'Confirmado',
    'Cancelado',
    'Concluido'
);

--ALTER TYPE status_agendamento ADD VALUE 'Reagendado';
CREATE TABLE
    tb_horarios (id SERIAL PRIMARY KEY, horario TIME NOT NULL);

--     SELECT horario
-- FROM tb_horarios
-- WHERE horario NOT IN (
--     SELECT EXTRACT(TIME FROM data_hora)
--     FROM tb_agendamentos
--     WHERE DATE(data_hora) = $1
-- );
CREATE TABLE
    tb_agendamentos (
        id SERIAL PRIMARY KEY,
        client_id INT REFERENCES tb_clientes (id),
        servico_id INT REFERENCES tb_services (id),
        data DATE NOT NULL,
        hora_id INT REFERENCES tb_horarios (id),
        status status_agendamento DEFAULT 'Agendado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP UNIQUE (data, hora_id)
    );