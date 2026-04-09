-- Database initialization for ClassHomework (Project S304)
-- Run this file against your PostgreSQL database to create the required tables.
-- Usage: psql -d <your_database> -f init.sql

CREATE TABLE IF NOT EXISTS subjects (
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS homework (
    id SERIAL PRIMARY KEY,
    homework_text TEXT NOT NULL,
    due_date TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    subject TEXT REFERENCES subjects(name) ON DELETE SET NULL,
    link TEXT
);
CREATE TABLE IF NOT EXISTS todos(
    todo_id   uuid default gen_random_uuid() not null,
    task      text                           not null,
    due_date  text                    not null,
    completed bool default false             not null,
    user_id   uuid                           not null
);

-- Single-row table that stores the controller's current Spotify playback state
-- so all /board instances can sync to it.
CREATE TABLE IF NOT EXISTS music_state (
    id         INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    position_s FLOAT       NOT NULL DEFAULT 0,
    duration_s FLOAT       NOT NULL DEFAULT 0,
    is_paused  BOOL        NOT NULL DEFAULT TRUE,
    synced_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO music_state (id) VALUES (1) ON CONFLICT DO NOTHING;

