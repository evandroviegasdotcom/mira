"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { findUserByEmail } from "@/services/user";
import React, { useState } from "react";
import { useContextForm } from "..";
import { getAuth } from "@/services/auth";

export default function Add() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setMembers, members } = useContextForm();
  const { toast } = useToast();
  const handleSearch = async () => {
    setIsLoading(true);
    const auth = await getAuth();
    const userToInvite = await findUserByEmail(email);
    setIsLoading(false);

    if (!!!userToInvite) return toast({ title: "User was not found!" });
    if (auth.user?.sub === userToInvite.id) return toast({ title: "You are a member already!" });

    toast({ title: "A new user was added to your members!" });
    const removeDuplicates = new Set([userToInvite, ...members]);
    const nMembers = Array.from(removeDuplicates);
    setMembers(nMembers);
  };
  return (
    <div className="flex items-center gap-1.5">
      <Input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="w-[300px] py-2"
      />
      <Button
        variant="secondary"
        disabled={email == "" || isLoading}
        onClick={handleSearch}
      >
        Invite
      </Button>
    </div>
  );
}
