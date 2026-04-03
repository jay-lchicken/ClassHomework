import { auth0 } from "@/lib/auth0";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

async function subToUuid(sub) {
    const result = await pool.query("SELECT md5($1)::uuid AS id", [sub]);
    return result.rows[0].id;
}

export async function PATCH(req, { params }) {
    const session = await auth0.getSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await subToUuid(session.user.sub);
    const { id } = await params;
    const { completed } = await req.json();

    const result = await pool.query(
        `UPDATE todos SET completed = $1 WHERE todo_id = $2 AND user_id = $3 RETURNING todo_id, task, due_date, completed`,
        [completed, id, userId]
    );

    if (result.rowCount === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
}

export async function DELETE(req, { params }) {
    const session = await auth0.getSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await subToUuid(session.user.sub);
    const { id } = await params;

    const result = await pool.query(
        `DELETE FROM todos WHERE todo_id = $1 AND user_id = $2`,
        [id, userId]
    );

    if (result.rowCount === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
}
