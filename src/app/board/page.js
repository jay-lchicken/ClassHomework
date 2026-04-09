import pool from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import { MUSIC_CONTROLLER_EMAIL } from "@/lib/constants";
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
    const session = await auth0.getSession();
    const isController = session?.user?.email === MUSIC_CONTROLLER_EMAIL;
    return <BoardView initialHomework={homeworkList} isController={isController} />;
}
