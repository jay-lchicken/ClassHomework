import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import HomePage from "@/app/Home";
import { Suspense } from "react";
import Add from "@/app/Home";
import {cookies} from "next/headers";
async function getHomeworkList() {
    try {
        const cookieStore = await cookies();

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getHomework`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
              "Cookie": cookieStore
          },
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
      }
}

export default async function Home() {
    const homeworkList = await getHomeworkList();


  return (
    <Add homeworkList={homeworkList} />
  );
}