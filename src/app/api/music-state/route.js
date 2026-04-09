import pool from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import { MUSIC_CONTROLLER_EMAIL } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT position_s, duration_s, is_paused, synced_at FROM music_state WHERE id = 1"
        );
        if (result.rowCount === 0) {
            return NextResponse.json({ position_s: 0, duration_s: 0, is_paused: true, synced_at: null });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching music state:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await auth0.getSession();
    if (session?.user?.email !== MUSIC_CONTROLLER_EMAIL) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { position_s, duration_s, is_paused } = await req.json();

    if (
        typeof position_s !== "number" || position_s < 0 ||
        typeof duration_s !== "number" || duration_s < 0 ||
        typeof is_paused !== "boolean"
    ) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    try {
        await pool.query(
            `INSERT INTO music_state (id, position_s, duration_s, is_paused, synced_at)
             VALUES (1, $1, $2, $3, NOW())
             ON CONFLICT (id) DO UPDATE
               SET position_s = EXCLUDED.position_s,
                   duration_s = EXCLUDED.duration_s,
                   is_paused  = EXCLUDED.is_paused,
                   synced_at  = NOW()`,
            [position_s, duration_s, is_paused]
        );
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error updating music state:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
