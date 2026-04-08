import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT *
             FROM homework
             WHERE due_date::DATE >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore')::DATE
             ORDER BY due_date::DATE ASC`
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching homework:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
