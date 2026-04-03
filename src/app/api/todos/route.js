import { auth0 } from "@/lib/auth0";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Convert Auth0 sub (e.g. "auth0|abc123") to a deterministic UUID via md5
function subToUuid(sub) {
    return pool.query("SELECT md5($1)::uuid AS id", [sub]);
}

export async function GET() {
    const session = await auth0.getSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uuidResult = await subToUuid(session.user.sub);
    const userId = uuidResult.rows[0].id;

    const result = await pool.query(
        `SELECT todo_id, task, due_date, completed FROM todos WHERE user_id = $1 ORDER BY due_date ASC`,
        [userId]
    );
    return NextResponse.json(result.rows);
}

export async function POST(req) {
    const session = await auth0.getSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { task, due_date } = await req.json();
    if (!task || !due_date) {
        return NextResponse.json({ error: "task and due_date are required" }, { status: 400 });
    }

    const uuidResult = await subToUuid(session.user.sub);
    const userId = uuidResult.rows[0].id;

    const result = await pool.query(
        `INSERT INTO todos (task, due_date, user_id) VALUES ($1, $2, $3) RETURNING todo_id, task, due_date, completed`,
        [task, due_date, userId]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
}
