"use client";
import { useState } from "react";
import { Calendar, BookOpen, Plus, Clock } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export default function Add({homeworkList, subjects}) {

    const [homework, setHomework] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [link, setLink] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [homeworkListState, setHomeworkListState] = useState(homeworkList || []);
    const { user } = useUser();
    const { toast } = useToast();
    const [showAddNewHomework, setShowAddNewHomework] = useState(false);
    




    const isValidUrl = (value) => {
        if (!value) return true;
        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    };

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
                    link: link.trim() || null,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast({
                    title: "Failed to add homework",
                    description: result.error || response.statusText,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Homework added",
                    description: `${homework} · ${selectedSubject}`,
                });
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
                    link: link.trim() || null,
                };
                setHomeworkListState(prev => [...prev, newHomework]);
                setHomework("");
                setDueDate("");
                setSelectedSubject("");
                setLink("");
                setShowAddNewHomework(false);
            }
        } catch (err) {
            toast({
                title: "Error adding homework",
                description: err?.message || String(err),
                variant: "destructive",
            });
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
        if (days < 0) return "text-red-600 bg-red-50 hover:bg-red-50 border-transparent";
        if (days <= 1) return "text-orange-600 bg-orange-50 hover:bg-orange-50 border-transparent";
        if (days <= 3) return "text-yellow-600 bg-yellow-50 hover:bg-yellow-50 border-transparent";
        return "text-green-600 bg-green-50 hover:bg-green-50 border-transparent";
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button type="button" className="rounded-full">
                                            <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                                                <AvatarImage src={user?.picture} alt={user?.name || "User"} />
                                                <AvatarFallback className="bg-slate-100 text-slate-700 text-sm font-semibold">
                                                    {(user?.name || "U").slice(0, 1).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>
                                            {user?.name || "Account"}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <a href="/auth/logout">Log out</a>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">



                {homeworkListState.length > 0 && (
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-slate-100 border-b border-slate-200">
                            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <BookOpen className="w-6 h-6"/>
                                Your Homework List
                            </CardTitle>
                            <CardDescription className="text-slate-600">
                                {homeworkListState.length} homework
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            Assignment
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            Link
                                        </TableHead>

                                        <TableHead className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            Subject
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            Added by
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            Due Date
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {homeworkListState.map((item, index) => {
                                        const daysUntilDue = getDaysUntilDue(item.due_date);
                                        return (
                                            <TableRow key={item.id || index}>
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.homework_text}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {item.link ? (
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            Open
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">—</span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="px-6 py-4">
                                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                                        {item.subject || "Others"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-sm text-gray-700">
                                                        {item.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-sm text-gray-700">
                                                        {formatDate(item.due_date)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-center">
                                                    <Badge className={`inline-flex items-center gap-1 ${getDueDateColor(item.due_date)}`}>
                                                        <Clock className="h-3 w-3"/>
                                                        {daysUntilDue < 0
                                                            ? `${Math.abs(daysUntilDue)} days overdue`
                                                            : daysUntilDue === 0
                                                            ? "Due today"
                                                            : daysUntilDue === 1
                                                            ? "Due tomorrow"
                                                            : `${daysUntilDue} days left`
                                                        }
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
                <Dialog open={showAddNewHomework} onOpenChange={setShowAddNewHomework}>
                    <DialogTrigger asChild>
                        <Button className="fixed bottom-4 right-4 z-50 rounded-full shadow-sm">
                            <Plus className="h-4 w-4" />
                            Add Homework
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-2">
                                <BookOpen className="h-6 w-6 text-slate-700" />
                            </div>
                            <DialogTitle>Add Homework</DialogTitle>
                            <DialogDescription>
                                Track assignments and due dates in one place.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="homework">Assignment</Label>
                                <Input
                                    id="homework"
                                    type="text"
                                    placeholder="Enter your homework assignment..."
                                    value={homework}
                                    onChange={(e) => setHomework(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger id="subject">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject} value={subject}>
                                                {subject}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link">Link (optional)</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                onClick={() => {
                                    if (!homework || !dueDate || !selectedSubject) {
                                        toast({
                                            title: "Missing details",
                                            description: "Please fill in all fields.",
                                            variant: "destructive",
                                        });
                                        return;
                                    }
                                    if (!isValidUrl(link.trim())) {
                                        toast({
                                            title: "Invalid link",
                                            description: "Please enter a valid http(s) URL or leave it blank.",
                                            variant: "destructive",
                                        });
                                        return;
                                    }
                                    addHomework();
                                }}
                                disabled={isAdding}
                            >
                                <Plus className="h-4 w-4" />
                                {isAdding ? "Adding..." : "Add Homework"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {homeworkListState.length === 0 && (
                    <Card className="mt-6">
                        <CardContent className="py-12 text-center">
                            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No homework yet</h3>
                            <p className="text-gray-500">Add the first homework using the button below.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Toaster />
        </div>
    );
}
