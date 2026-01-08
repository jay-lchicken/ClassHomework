import { auth0 } from "@/lib/auth0";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import {DateTime} from "luxon";

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
  const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
const getDaysUntilDue = (dueDateStr) => {
    const todaySGT = DateTime.now().setZone("Asia/Singapore").startOf("day");
    const dueSGT = DateTime.fromISO(dueDateStr, { zone: "Asia/Singapore" }).startOf("day");
    const diffDays = Math.ceil(dueSGT.diff(todaySGT, "days").days);
    return diffDays;
};
  var message = "Hello. These are the upcoming homework that are due soon. You may add to the homework list @ https://class-homework.vercel.app/ : "
  if (insertResult.rows.length === 0) {
      message+=`\nNo homework has been added! `
  }else {
      for (let i = 0;    i < insertResult.rows.length; i++) {

    const row = insertResult.rows[i];
        const daysUntilDue = getDaysUntilDue(row.due_date);

    message += `\n${i+1}. ${row.homework_text} - Due: ${formatDate(row.due_date)}, ${daysUntilDue < 0
                                                            ? `${Math.abs(daysUntilDue)} days overdue`
                                                            : daysUntilDue === 0
                                                            ? "Today"
                                                            : daysUntilDue === 1
                                                            ? "Tomorrow"
                                                            : `${daysUntilDue} days left`
                         
                                                        } (By: ${row.name.slice(0,4)}.)`;

  }
  }

  return new Response(JSON.stringify(message), {
    headers: { "Content-Type": "application/json" },
  });
}