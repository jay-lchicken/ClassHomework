import { auth0 } from "@/lib/auth0";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth0.getSession();
  const body = await req.json();

  const { homework, due_date } = body;

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const email = session.user.email;
  const userName = session.user.name;
  
  console.log("email:", email);
  
  if (!email.endsWith("@s2024.ssts.edu.sg") && !email.endsWith("@sst.edu.sg")) {
    return NextResponse.json({ error: 'Pls use school account' }, { status: 401 });
  }
  
  if ( !homework || !due_date || !email) {
     return NextResponse.json({ error: 'Not all fields are field' }, { status: 401 });
  }


  const insertResult = await pool.query(
      `INSERT INTO homework (homework_text, due_date, email, name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [homework, due_date, email, userName ]
    );

  return new Response(JSON.stringify(insertResult.rows[0]), {
    headers: { "Content-Type": "application/json" },
  });
}