"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "@/services/auth";
import { findUserByEmail } from "@/services/user";
import React, {  useState } from "react";
import { useFormContext } from "..";


export default function Add() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { members, setMembers } = useFormContext()

  const { toast } = useToast();
  const onInviteButtonClick = async () => {
    try {
      setIsLoading(true);

      const auth = await getAuth();
      const userToInvite = await findUserByEmail(email);
      if (!userToInvite) return toast({ title: "User was not found!" });
      if (auth.user?.sub === userToInvite.id)
        return toast({ title: "You are a member already!" });

    const removeDuplicates = new Set([userToInvite, ...members])
    const nMembers = Array.from(removeDuplicates)
    setMembers(nMembers)
    toast({ title: "A new user was added to your members list!" })

    } catch (error) {
      toast({ title: "An error occured!", description: JSON.stringify(error) });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="email"
        className="w-[300px] py-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="secondary"
        disabled={email == "" || isLoading}
        onClick={onInviteButtonClick}
      >
        Invite
      </Button>
    </div>
  );
}
