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


CREATE TABLE tb_horarios (
    id SERIAL PRIMARY KEY,
    horario TIME NOT NULL
);

--     SELECT horario
-- FROM tb_horarios
-- WHERE horario NOT IN (
--     SELECT EXTRACT(TIME FROM data_hora)
--     FROM tb_agendamentos
--     WHERE DATE(data_hora) = $1
-- );

CREATE TABLE tb_agendamentos (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES tb_clientes(id),
    servico_id INT REFERENCES tb_services(id),
    data_agendamento DATE NOT NULL,
    hora_id INT REFERENCES tb_horarios(id),
    status status_agendamento DEFAULT 'Agendado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (data_agendamento, hora_id)
);

CREATE TABLE tb_categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tipo VARCHAR(10) NOT NULL,  -- 'fixa' ou 'variavel'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tb_saidas (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    id_categoria INT REFERENCES tb_categorias(id),
    valor DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_entradas (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    id_servico INT REFERENCES tb_services(id),
    quantidade INT NOT NULL DEFAULT 1,
    valor DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2) GENERATED ALWAYS AS (quantidade * valor) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW vw_fluxo_mensal AS
SELECT
    DATE_TRUNC('month', d)::date AS mes,
    COALESCE(SUM(e.valor_total), 0) AS total_entradas,
    COALESCE(SUM(s.valor), 0) AS total_saidas,
    COALESCE(SUM(e.valor_total), 0) - COALESCE(SUM(s.valor), 0) AS saldo
FROM
    generate_series(
        (SELECT MIN(created_at)::date FROM tb_entradas),
        CURRENT_DATE,
        INTERVAL '1 day'
    ) d
LEFT JOIN tb_entradas e ON DATE(e.created_at) = d
LEFT JOIN tb_saidas s ON DATE(s.created_at) = d
GROUP BY mes
ORDER BY mes;

--Entradas por Mês
SELECT 
    DATE_TRUNC('month', created_at) AS mes,
    SUM(valor_total)
FROM tb_entradas
GROUP BY mes
ORDER BY mes;

--Saídas por Mês
SELECT
    DATE_TRUNC('month', created_at) AS mes,
    SUM(valor) AS total_saidas
FROM tb_saidas
GROUP BY mes
ORDER BY mes DESC;

--Serviços Mais Vendidos
SELECT
    s.nome AS servico,
    COUNT(e.id) AS total_vendas,
    SUM(e.valor) AS total_receita
FROM tb_entradas e
INNER JOIN tb_services s ON s.id = e.id_servico
GROUP BY s.nome
ORDER BY total_vendas DESC;


--Receita por Cliente
SELECT
    c.nome AS cliente,
    SUM(e.valor) AS total_gasto
FROM tb_entradas e
LEFT JOIN tb_agendamentos a ON a.servico_id = e.id_servico
LEFT JOIN tb_clientes c ON c.id = a.client_id
GROUP BY c.nome
ORDER BY total_gasto DESC;

--Despesas por Categoria
SELECT
    cat.nome AS categoria,
    cat.tipo,
    SUM(s.valor) AS total
FROM tb_saidas s
INNER JOIN tb_categorias cat ON cat.id = s.id_categoria
GROUP BY cat.nome, cat.tipo
ORDER BY total DESC;


--Agendamentos do Dia
SELECT
    a.id,
    c.nome AS cliente,
    s.nome AS servico,
    a.data_agendamento,
    h.horario,
    a.status
FROM tb_agendamentos a
INNER JOIN tb_clientes c ON c.id = a.client_id
INNER JOIN tb_services s ON s.id = a.servico_id
INNER JOIN tb_horarios h ON h.id = a.hora_id
WHERE a.data_agendamento = CURRENT_DATE
ORDER BY h.horario;

--Agendamentos por Status
SELECT
    status,
    COUNT(*) AS total
FROM tb_agendamentos
GROUP BY status
ORDER BY total DESC;

--Horários Disponíveis para um Dia
SELECT h.horario
FROM tb_horarios h
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_agendamentos a
    WHERE a.hora_id = h.id
      AND a.data_agendamento = $1
);