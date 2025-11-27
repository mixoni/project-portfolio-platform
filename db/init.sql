CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  owner VARCHAR(100) NOT NULL,
  risk_level VARCHAR(50) NOT NULL,
  budget NUMERIC(12,2),
  start_date DATE,
  end_date DATE
);

INSERT INTO roles (name) VALUES ('ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('USER') ON CONFLICT (name) DO NOTHING;

-- password hashes should be updated by a seed script; placeholder here
INSERT INTO users (username, password_hash, role_id)
SELECT 'admin', '$2b$10$changemeadminhash', r.id FROM roles r WHERE r.name = 'ADMIN'
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password_hash, role_id)
SELECT 'user', '$2b$10$changemeuserhash', r.id FROM roles r WHERE r.name = 'USER'
ON CONFLICT (username) DO NOTHING;

INSERT INTO projects (name, status, owner, risk_level, budget, start_date, end_date)
VALUES
('Project Alpha', 'IN_PROGRESS', 'admin', 'MEDIUM', 100000, '2024-01-01', '2024-12-31'),
('Project Beta', 'PLANNED', 'user', 'LOW', 50000, '2024-03-01', '2024-10-31')
ON CONFLICT DO NOTHING;
