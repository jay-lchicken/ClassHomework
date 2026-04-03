import Add from "@/app/Home";
import pool from "@/lib/db";
import { auth0 } from "@/lib/auth0";
async function getHomeworkList() {
    try {
        const insertResult = await pool.query(
    `SELECT *
FROM homework
WHERE due_date::DATE >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore')::DATE
ORDER BY due_date::DATE ASC;`
  );
        return insertResult.rows;

    }
    catch (error) {
        console.error("Error fetching homework list:", error);
        return [];
    }

}
async function getSubjects(){
    try{
        const subjects = await pool.query(`
        SELECT * FROM subjects;`)
        console.log(subjects.rows.map(subject => subject.name));
        return subjects.rows.map(subject => subject.name);
    }catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
}


async function getTodos(sub) {
    try {
        const uuidResult = await pool.query("SELECT md5($1)::uuid AS id", [sub]);
        const userId = uuidResult.rows[0].id;
        const result = await pool.query(
    `SELECT todo_id, task, due_date, completed FROM todos WHERE user_id = $1 AND due_date::DATE >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore')::DATE ORDER BY due_date ASC`,
    [userId]
);
        return result.rows;
    } catch (error) {
        console.error("Error fetching todos:", error);
        return [];
    }
}

export default async function Home() {
    const homeworkList = await getHomeworkList();
    const subjects = await getSubjects();
    const session = await auth0.getSession();
    const todos = session?.user?.sub ? await getTodos(session.user.sub) : [];

  return (
    <Add homeworkList={homeworkList} subjects={subjects} initialTodos={todos} />
  );
}
