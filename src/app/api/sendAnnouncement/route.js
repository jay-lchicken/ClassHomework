import pool from "@/lib/db";
import {DateTime} from "luxon";

export async function GET(req) {

  const insertResult = await pool.query(
    `SELECT *
FROM homework
WHERE due_date::DATE >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore')::DATE
ORDER BY subject ASC, due_date::DATE ASC;`
  );

  const formatDueDay = (dueDateStr) => {
    const todaySGT = DateTime.now().setZone("Asia/Singapore").startOf("day");
    const dueSGT = DateTime.fromISO(dueDateStr, { zone: "Asia/Singapore" }).startOf("day");
    const diffDays = Math.ceil(dueSGT.diff(todaySGT, "days").days);
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    
    return dueSGT.toFormat("d MMM");
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });

  const subjectMap = {};
  insertResult.rows.forEach(row => {
    const subject = row.subject || "Others";
    if (!subjectMap[subject]) {
      subjectMap[subject] = [];
    }
    subjectMap[subject].push(row);
  });

  const subject = await pool.query('SELECT * FROM subjects;');
  const allSubjects =  subject.rows.map(subj => subj.name);



  let message = `*${todayStr}*\n\n`;

  allSubjects.forEach(subject => {
    message += `${subject}\n`;

    if (subjectMap[subject] && subjectMap[subject].length > 0) {
      subjectMap[subject].forEach(row => {
        const dueDay = formatDueDay(row.due_date);
        message += `• ${row.homework_text} (${dueDay})\n`;
      });
    } else {
      message += `(no homework)\n`;
    }

    message += `\n`;
  });
  message += `Others`;

    if (subjectMap["Others"] && subjectMap["Others"].length > 0) {
      subjectMap["Others"].forEach(row => {
        const dueDay = formatDueDay(row.due_date);
        message += `• ${row.homework_text} (${dueDay})\n`;
      });
    } else {
      message += `(no homework)\n`;
    }

    message += `\n`;

  return new Response(JSON.stringify(message), {
    headers: { "Content-Type": "application/json" },
  });
}
