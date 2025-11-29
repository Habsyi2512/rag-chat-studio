import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cmsFetch } from "@/lib/cms";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Notification {
    id: string;
    data: {
        title: string;
        message: string;
        type: "info" | "success" | "warning" | "error";
        user_name: string;
    };
    read_at: string | null;
    created_at: string;
}

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await cmsFetch("/notifications");
            const data = response.data || [];
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.read_at).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    // Polling every 10 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await cmsFetch(`/notifications/${id}/read`, { method: "POST" });
            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await cmsFetch(`/notifications/read-all`, { method: "POST" });
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs h-6" onClick={handleMarkAllRead}>
                            Tandai semua dibaca
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Tidak ada notifikasi
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start p-4 space-y-1 cursor-pointer ${!notification.read_at ? "bg-muted/50" : ""
                                    }`}
                                onClick={() => handleMarkAsRead(notification.id)}
                            >
                                <div className="flex w-full justify-between items-start">
                                    <span className="font-medium text-sm">
                                        {notification.data.title}
                                    </span>
                                    {!notification.read_at && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.data.message}
                                </p>
                                <div className="flex w-full justify-between items-center mt-2">
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(notification.created_at).toLocaleString("id-ID")}
                                    </span>
                                    <span className="text-[10px] font-semibold text-primary">
                                        {notification.data.user_name}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
