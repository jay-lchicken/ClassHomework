import { auth0 } from "@/lib/auth0";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth0.getSession();
      const body = await req.json();

    const { homework, due_date, subject, link } = body;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const email = session.user.email;
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 401 });
  }
  if (!email.endsWith("@s2024.ssts.edu.sg") && !email.endsWith("sst.edu.sg")) {
    return NextResponse.json({ error: 'Pls use school account' }, { status: 401 });
  }
  const displayName =
    session.user.name ||
    session.user.nickname ||
    email;
  if ( !homework || !due_date || !subject || !email) {
     return NextResponse.json({ error: 'Not all fields are field' }, { status: 401 });
  }
  const trimmedLink = typeof link === "string" ? link.trim() : "";
  const normalizedLink = trimmedLink.length > 0 ? trimmedLink : null;
  if (normalizedLink) {
    try {
      const url = new URL(normalizedLink);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return NextResponse.json({ error: "Link must start with http or https" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid link URL" }, { status: 400 });
    }
  }
  const formattedSubject = subject === "Others" ? null : subject;
  console.log(formattedSubject);


  try{
    const insertResult = await pool.query(
      `INSERT INTO homework (homework_text, due_date, email, name, subject, link)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [homework, due_date, email, displayName, formattedSubject, normalizedLink]
    );
    return new Response(JSON.stringify(insertResult.rows[0]), {
    headers: { "Content-Type": "application/json" },
  });
  }catch (error) {
    console.error("Error inserting homework:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }


}
