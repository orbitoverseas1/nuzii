"use client";

import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const UserMenu = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <Link
                href="/signin"
                className="text-nuziiText hover:text-nuziiRoseGoldDark transition-colors"
            >
                <User className="w-5 h-5" />
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <div className="w-8 h-8 rounded-full border border-nuziiRoseGold/30 overflow-hidden relative">
                    {user.photoURL ? (
                        <Image
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-nuziiRoseGold/10 flex items-center justify-center text-nuziiRoseGoldDark font-medium">
                            {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </div>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-nuziiSand">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-nuziiText">
                            {user.displayName}
                        </p>
                        <p className="text-xs leading-none text-nuziiTextLight">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-nuziiSand/50" />
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-nuziiCream focus:text-nuziiRoseGoldDark">
                    <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600"
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
