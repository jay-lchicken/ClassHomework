import { getAuth } from "@clerk/nextjs/server";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {

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