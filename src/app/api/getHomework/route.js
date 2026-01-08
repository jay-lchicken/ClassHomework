import { auth0 } from "@/lib/auth0";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const insertResult = await pool.query(
    `SELECT *
FROM homework
WHERE due_date::DATE >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore')::DATE
ORDER BY due_date::DATE ASC;`
  );

  return new Response(JSON.stringify(insertResult.rows), {
    headers: { "Content-Type": "application/json" },
  });
}