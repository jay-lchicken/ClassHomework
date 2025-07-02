import { getAuth } from "@clerk/nextjs/server";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import {clerkClient} from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId, sessionClaims } = getAuth(req);
      const body = await req.json();

    const { homework, due_date } = body;

  if (!userId  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  console.log("sessionClaims:", sessionClaims);
  const email = sessionClaims?.email;
  console.log("email:", email);
  if (!email.endsWith("@s2024.ssts.edu.sg") && !email.endsWith("sst.edu.sg")) {
    return NextResponse.json({ error: 'Pls use school account' }, { status: 401 });
  }
  const clients = await clerkClient()

  const user = await clients.users.getUser(userId);
  if ( !homework || !due_date || !email) {
     return NextResponse.json({ error: 'Not all fields are field' }, { status: 401 });
  }


  const insertResult = await pool.query(
      `INSERT INTO homework (homework_text, due_date, email, name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [homework, due_date, email, user.fullName ]
    );

  return new Response(JSON.stringify(insertResult.rows[0]), {
    headers: { "Content-Type": "application/json" },
  });
}