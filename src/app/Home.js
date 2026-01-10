"use client";
import Image from "next/image";
import {useState, useEffect} from "react";
import {Calendar, BookOpen, Plus, Trash2, Clock, Badge} from 'lucide-react';
import { useUser } from "@auth0/nextjs-auth0/client";
import {DateTime} from "luxon";
export default function Add({homeworkList, subjects}) {

    const [homework, setHomework] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [homeworkListState, setHomeworkListState] = useState(homeworkList || []);
    const { user } = useUser();
    const [showAddNewHomework, setShowAddNewHomework] = useState(false);
    




    const addHomework = async () => {
        setIsAdding(true);
        try {
            const response = await fetch("/api/addHomework", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    homework: homework,
                    due_date: dueDate,
                    subject: selectedSubject,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert("Failed to add homework: " + (result.error || response.statusText));
            } else {
                alert("Homework added!");
                const displayName =
  user?.name ||
  user?.nickname ||
  user?.email ||
  "Unknown";
                const newHomework = {
                    homework_text: homework,
                    due_date: dueDate,
                    name: displayName,
                    subject: selectedSubject,
                };
                setHomeworkListState(prev => [...prev, newHomework]);
                setHomework("");
                setDueDate("");
                setSelectedSubject("");
            }
        } catch (err) {
            alert("ERROR! Failed to add homework" + (err.message || err));
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };



    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
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

    const getDueDateColor = (dueDate) => {
        const days = getDaysUntilDue(dueDate);
        if (days < 0) return "text-red-600 bg-red-50";
        if (days <= 1) return "text-orange-600 bg-orange-50";
        if (days <= 3) return "text-yellow-600 bg-yellow-50";
        return "text-green-600 bg-green-50";
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
                    <div className="h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold">
                                S
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm text-slate-500">Project</div>
                                <h1 className="text-base font-semibold text-slate-900">S304</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-slate-900">
                                        {user?.name || "Unknown"}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {user?.email || ""}
                                    </div>
                                </div>
                                <div className="relative">
                                    {user?.picture ? (
                                        <img
                                            src={user.picture}
                                            alt={user?.name || "User"}
                                            className="w-9 h-9 rounded-full border border-slate-200 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center text-slate-700 text-sm font-semibold">
                                            {(user?.name || "U").slice(0, 1).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <a
                                href="/auth/logout"
                                className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Log out
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">



                {homeworkListState.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-100 border-b border-slate-200">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <BookOpen className="w-6 h-6"/>
                                Your Homework List ({homeworkListState.length})
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                                            Assignment
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                                            Due Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                                            Subject
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                                            Added by
                                        </th>


                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b">
                                            Status
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {homeworkListState.map((item, index) => {
                                        const daysUntilDue = getDaysUntilDue(item.due_date);
                                        return (
                                            <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.homework_text}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-700">
                                                        {formatDate(item.due_date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        {item.subject || "Others"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-700">
                                                        {item.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getDueDateColor(item.due_date)}`}>
                                                        <Clock className="w-3 h-3"/>
                                                        {daysUntilDue < 0
                                                            ? `${Math.abs(daysUntilDue)} days overdue`
                                                            : daysUntilDue === 0
                                                            ? "Due today"
                                                            : daysUntilDue === 1
                                                            ? "Due tomorrow"
                                                            : `${daysUntilDue} days left`
                                                        }
                                                    </span>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div className={"fixed bottom-4 right-4 z-50"}>
                    <button
                        onClick={() => setShowAddNewHomework(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5"/>
                        Add Homework
                    </button>
                </div>

                {homeworkListState.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No homework yet</h3>
                        <p className="text-gray-500">Add the first homework using the form above.</p>
                    </div>
                )}

                {showAddNewHomework && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => setShowAddNewHomework(false)}
                aria-label="Close"
            >
                &times;
            </button>
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                    <BookOpen className="w-8 h-8 text-slate-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Homework</h1>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="homework" className="block text-sm font-semibold text-gray-700">
                        Assignment
                    </label>
                    <div className="relative">
                        <input
                            id="homework"
                            type="text"
                            placeholder="Enter your homework assignment..."
                            value={homework}
                            onChange={(e) => setHomework(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700">
                        Due Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="text-black w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">
                        Subject
                    </label>
                    <select
                        id="subject"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        required
                    >
                        <option value="" disabled>Select a subject</option>

                        {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>

                        ))}
                        <option value="Others">Others</option>
                    </select>
                </div>

                <button
                    type="submit"
                    onClick={() => {
                        if (!homework || !dueDate || !selectedSubject) {
                            alert("Please fill in all fields.");
                            return;
                        }
                        addHomework();
                    }}
                    disabled={isAdding}
                    className="disabled:opacity-50 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5"/>
                    {isAdding ? "Adding..." : "Add Homework"}
                </button>
            </div>
        </div>
    </div>
)}
            </div>
        </div>
    );
}
