"use client";
import { CheckSquare, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DateTime } from "luxon";

export default function MyTodoCard({ todos, onToggle, onDelete }) {
    const formatDate = (iso) =>
        DateTime.fromISO(iso, { zone: "Asia/Singapore" }).toLocaleString(DateTime.DATE_MED);

    const getDaysUntilDue = (iso) => {
        const today = DateTime.now().setZone("Asia/Singapore").startOf("day");
        const due = DateTime.fromISO(iso, { zone: "Asia/Singapore" }).startOf("day");
        return Math.ceil(due.diff(today, "days").days);
    };

    const getDueBadgeClass = (iso) => {
        const days = getDaysUntilDue(iso);
        if (days < 0) return "text-destructive bg-destructive/10 hover:bg-destructive/10 border-transparent";
        if (days <= 1) return "text-orange-600 bg-orange-600/10 hover:bg-orange-600/10 border-transparent dark:text-orange-400 dark:bg-orange-400/10";
        if (days <= 3) return "text-yellow-600 bg-yellow-600/10 hover:bg-yellow-600/10 border-transparent dark:text-yellow-400 dark:bg-yellow-400/10";
        return "text-green-600 bg-green-600/10 hover:bg-green-600/10 border-transparent dark:text-green-400 dark:bg-green-400/10";
    };

    const pending = todos.filter((t) => !t.completed);
    const completed = todos.filter((t) => t.completed);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <CheckSquare className="w-6 h-6" />
                    My To-Do List
                </CardTitle>
                <CardDescription>
                    {pending.length} pending · {completed.length} completed
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {todos.length === 0 ? (
                    <div className="py-10 text-center text-muted-foreground text-sm">
                        No tasks yet. Click <span className="font-medium text-foreground">Add to my list</span> on a homework item below.
                    </div>
                ) : (
                    <ul className="divide-y">
                        {[...pending, ...completed].map((todo) => (
                            <li key={todo.todo_id} className="flex items-start gap-3 px-6 py-4">
                                <Switch
                                    checked={todo.completed}
                                    onCheckedChange={() => onToggle(todo.todo_id, todo.completed)}
                                    className="mt-0.5 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium leading-snug ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                                        {todo.task}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{formatDate(todo.due_date)}</span>
                                        {!todo.completed && (
                                            <Badge className={`text-xs ${getDueBadgeClass(todo.due_date)}`}>
                                                {(() => {
                                                    const d = getDaysUntilDue(todo.due_date);
                                                    if (d < 0) return `${Math.abs(d)}d overdue`;
                                                    if (d === 0) return "Due today";
                                                    if (d === 1) return "Due tomorrow";
                                                    return `${d}d left`;
                                                })()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDelete(todo.todo_id)}
                                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                                    aria-label="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
