
import { getAuth } from "@/services/auth";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Profile() {
  const { user, isLoggedIn } = await getAuth();
  if (!isLoggedIn) return null;
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Image
          src={user.picture}
          alt="Picture"
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
        <span className="small-title">{user.name}</span>
      </div>
    <Link href="/api/auth/logout">
    <LogOut className="text-xs transition-all text-zinc-700 hover:text-red-700" />
    
    </Link>
    </div>
  );
}
