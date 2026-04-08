import pool from "@/lib/db";
import BoardView from "./BoardView";

async function getHomeworkList() {
    try {
        const result = await pool.query(
            `SELECT *
             FROM homework
             WHERE due_date::DATE >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Singapore')::DATE
             ORDER BY due_date::DATE ASC`
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching homework list:", error);
        return [];
    }
}

export default async function BoardPage() {
    const homeworkList = await getHomeworkList();
    return <BoardView initialHomework={homeworkList} />;
}
