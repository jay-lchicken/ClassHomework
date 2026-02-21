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
