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
  var message = "Hello. These are the upcoming homework that are due soon. You may add to the homework list @ https://hw.techtime.coffee/ (It does not work on school wifi, pls use hotspot): "
  for (let i = 0; i < insertResult.rows.length; i++) {
    const row = insertResult.rows[i];
    message += `\n${i+1}. ${row.homework_text} - Due: ${row.due_date} (By: ${row.name})`;

  }

  return new Response(JSON.stringify(message), {
    headers: { "Content-Type": "application/json" },
  });
}