"use client";

import { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import { BookOpen, Clock, RefreshCw, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";

const RELOAD_INTERVAL = 30_000;

function getDaysUntilDue(dueDateStr) {
    const todaySGT = DateTime.now().setZone("Asia/Singapore").startOf("day");
    const dueSGT = DateTime.fromISO(dueDateStr, { zone: "Asia/Singapore" }).startOf("day");
    return Math.ceil(dueSGT.diff(todaySGT, "days").days);
}

function getHexColors(days) {
    if (days < 0) return { bg: "bg-red-600/95", text: "text-white", border: "border-red-700", label: "bg-red-700" };
    if (days <= 1) return { bg: "bg-red-400/90", text: "text-white", border: "border-red-500", label: "bg-red-500" };
    if (days <= 3) return { bg: "bg-gray-400/90", text: "text-white", border: "border-gray-500", label: "bg-gray-500" };
    return { bg: "bg-gray-800/90", text: "text-white", border: "border-gray-900", label: "bg-gray-900" };
}

function formatDate(dateString) {
    return DateTime.fromISO(dateString, { zone: "Asia/Singapore" }).toFormat("MMM d");
}

function HexagonTile({ item, onClick }) {
    const days = getDaysUntilDue(item.due_date);
    const colors = getHexColors(days);

    const daysLabel =
        days < 0
            ? `${Math.abs(days)}d overdue`
            : days === 0
            ? "Due today"
            : days === 1
            ? "Tomorrow"
            : `${days}d left`;

    return (
        <button
            type="button"
            onClick={() => onClick(item)}
            className="group relative flex items-center justify-center focus:outline-none"
            style={{ width: 140, height: 162 }}
            aria-label={`Homework: ${item.homework_text}`}
        >
            {/* Hexagon shape via clip-path — regular pointy-top hexagon (w:h = √3:2) */}
            <div
                className={`absolute inset-0 transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105 ${colors.bg} shadow-md`}
                style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
            />
            {/* Content */}
            <div className={`relative z-10 flex flex-col items-center justify-center gap-1 px-5 text-center ${colors.text}`} style={{ width: 120 }}>
                <span className="text-[11px] font-semibold leading-tight line-clamp-3 break-words w-full">
                    {item.homework_text}
                </span>
                {item.subject && (
                    <span className="text-[9px] font-medium opacity-80 truncate max-w-full">
                        {item.subject}
                    </span>
                )}
                <span className="text-[10px] font-bold mt-0.5 opacity-90">{daysLabel}</span>
            </div>
        </button>
    );
}

export default function BoardView({ initialHomework }) {
    const [homeworkList, setHomeworkList] = useState(initialHomework || []);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [countdown, setCountdown] = useState(RELOAD_INTERVAL / 1000);
    const [selected, setSelected] = useState(null);

    const fetchHomework = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch("/api/homework");
            if (res.ok) {
                const data = await res.json();
                setHomeworkList(data);
                setLastUpdated(new Date());
                setCountdown(RELOAD_INTERVAL / 1000);
            }
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    // Auto-reload every 30 s
    useEffect(() => {
        const timer = setInterval(fetchHomework, RELOAD_INTERVAL);
        return () => clearInterval(timer);
    }, [fetchHomework]);

    // Countdown ticker
    useEffect(() => {
        const tick = setInterval(() => {
            setCountdown((c) => (c > 1 ? c - 1 : c));
        }, 1000);
        return () => clearInterval(tick);
    }, []);

    // Arrange items in offset honeycomb rows
    const cols = 5;
    const rows = [];
    for (let i = 0; i < homeworkList.length; i += cols) {
        rows.push(homeworkList.slice(i, i + cols));
    }

    const handleDialogClose = useCallback(() => setSelected(null), []);
    const selectedDays = selected ? getDaysUntilDue(selected.due_date) : 0;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="w-full bg-card border-b sticky top-0 z-40">
                <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
                    <div className="h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                S
                            </div>
                            <div className="leading-tight">
                                <div className="text-sm text-muted-foreground">Project</div>
                                <h1 className="text-base font-semibold">S304</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="/"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                            >
                                List view
                            </a>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                                <span>{countdown}s</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={fetchHomework} disabled={isRefreshing}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Board */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <LayoutGrid className="h-6 w-6" />
                            Homework Board
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {homeworkList.length} upcoming assignment{homeworkList.length !== 1 ? "s" : ""} · last
                            updated {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                    {/* Legend */}
                    <div className="hidden sm:flex items-center gap-3 text-xs">
                        {[
                            { label: "Overdue", cls: "bg-red-600" },
                            { label: "≤ 1 day", cls: "bg-red-400" },
                            { label: "≤ 3 days", cls: "bg-gray-400" },
                            { label: "4+ days", cls: "bg-gray-800" },
                        ].map(({ label, cls }) => (
                            <span key={label} className="flex items-center gap-1">
                                <span className={`inline-block w-3 h-3 rounded-sm ${cls}`} />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                {homeworkList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                        <BookOpen className="h-12 w-12 opacity-30" />
                        <p className="text-lg font-medium">No upcoming homework 🎉</p>
                        <p className="text-sm">Check back later or add a new assignment on the list view.</p>
                    </div>
                ) : (
                    /* Honeycomb grid */
                    <div className="flex flex-col items-center gap-0" style={{ paddingBottom: 40 }}>
                        {rows.map((row, rowIdx) => (
                            <div
                                key={rowIdx}
                                className="flex"
                                style={{
                                    marginTop: rowIdx === 0 ? 0 : -40, // 25% of hex height (162) for honeycomb overlap
                                    marginLeft: rowIdx % 2 === 1 ? 74 : 0, // half of (tile width 140 + gap 8) for offset rows
                                }}
                            >
                                {row.map((item) => (
                                    <div key={item.id} style={{ margin: "0 4px" }}>
                                        <HexagonTile item={item} onClick={setSelected} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Detail Dialog */}
            <Dialog open={!!selected} onOpenChange={(open) => { if (!open) handleDialogClose(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-2">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <DialogTitle>{selected?.homework_text}</DialogTitle>
                        <DialogDescription>
                            {selected?.subject || "No subject"} · Added by {selected?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Due {formatDate(selected.due_date)}</span>
                                <Badge
                                    className={`ml-auto ${
                                        selectedDays < 0
                                            ? "bg-red-100 text-red-700"
                                            : selectedDays <= 1
                                            ? "bg-red-100 text-red-500"
                                            : selectedDays <= 3
                                            ? "bg-gray-100 text-gray-600"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {selectedDays < 0
                                        ? `${Math.abs(selectedDays)} days overdue`
                                        : selectedDays === 0
                                        ? "Due today"
                                        : selectedDays === 1
                                        ? "Due tomorrow"
                                        : `${selectedDays} days left`}
                                </Badge>
                            </div>
                            {selected.link && (
                                <a
                                    href={selected.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline break-all"
                                >
                                    {selected.link}
                                </a>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
