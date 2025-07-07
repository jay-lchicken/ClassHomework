"use client";
import Image from "next/image";
import {useState, useEffect} from "react";
import {Calendar, BookOpen, Plus, Trash2, Clock} from 'lucide-react';
import {useUser} from "@clerk/nextjs";
export default function Add({homeworkList}) {
    const [homework, setHomework] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [homeworkListState, setHomeworkListState] = useState(homeworkList || []);
    const user = useUser()



    const addHomework = async () => {
        setIsAdding(true);
        try {
            const response = await fetch("/api/addHomework", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    homework: homework,
                    due_date: dueDate,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert("Failed to add homework: " + (result.error || response.statusText));
            } else {
                alert("Homework added!");
                const displayName =
  user.user?.fullName ||
  `${user.user?.firstName || ""} ${user.user?.lastName || ""}`.trim() ||
  "Unknown";
                const newHomework = {
                    homework_text: homework,
                    due_date: dueDate,
                    name: displayName,
                };
                setHomeworkListState(prev => [...prev, newHomework]);
                setHomework("");
                setDueDate("");
            }
        } catch (err) {
            alert("ERROR! Failed to add homework" + (err.message || err));
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
                                <BookOpen className="w-8 h-8 text-white"/>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Homework</h1>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
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

                                <button
                                    type="submit"
                                    onClick={() => {
                                        if (!homework || !dueDate) {
                                            alert("Please fill in all fields.");
                                            return;
                                        }
                                        addHomework();
                                    }}
                                    disabled={isAdding}
                                    className="disabled:opacity-50 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5"/>
                                    {isAdding ? "Adding..." : "Add Homework"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {homeworkListState.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
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

                {homeworkListState.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No homework yet</h3>
                        <p className="text-gray-500">Add the first homework using the form above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}