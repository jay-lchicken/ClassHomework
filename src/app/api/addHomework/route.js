import { auth0 } from "@/lib/auth0";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
function generateRandomCode() {
  return Math.floor(Math.random() * 90000) + 10000;
}

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
  const code = generateRandomCode();
  console.log(code)

  try {
    const apiResponse = await fetch("https://linxy.techtime.coffee/api/links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.JWT_TOKEN.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link,
        tag: String(code),
        description: "Shortened by on Project S304",
        baseUrl: "link.s304.xyz",
      }),
    });

    const text = await apiResponse.text();
    console.log("External API status:", apiResponse.status, "body:", text);

    if (!apiResponse.ok) {
      const errorBody = JSON.parse(text);
      return NextResponse.json(
        { error: `Failed to shorten link: ${errorBody.error}` },
        { status: apiResponse.status }
      );
    }

  } catch (error) {
    console.error("Error shortening link:", error);
    return NextResponse.json(
        { error: `Failed to shorten link:  ${error}` },
        { status: 500 }
    );
  }


  try{
    const insertResult = await pool.query(
        `INSERT INTO homework (homework_text, due_date, email, name, subject, link)
         VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
        [homework, due_date, email, displayName, formattedSubject, `https://link.s304.xyz/${code}`]
    );
    return new Response(JSON.stringify(insertResult.rows[0]), {
      headers: { "Content-Type": "application/json" },
    });
  }catch (error) {
    console.error("Error inserting homework:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }


}
