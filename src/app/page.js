import Add from "@/app/Home";
import { cookies } from "next/headers";
import pool from "@/lib/db";
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


export default async function Home() {
    const homeworkList = await getHomeworkList();
    const subjects = await getSubjects();


  return (
    <Add homeworkList={homeworkList} subjects={subjects}/>
  );
}
