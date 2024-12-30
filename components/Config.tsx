"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TbSettings } from "react-icons/tb";
import Link from "next/link";
import { deleteProject } from "@/services/project";
import { ProjectWithMembers } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { User } from "@/types/user";

export default function Config({
  project,
  icon,
  authedUser
}: {
  project: ProjectWithMembers;
  icon?: React.ReactNode;
  authedUser: User
}) {
  const { id } = project;
  const { toast } = useToast();
  const router = useRouter();
  const handleDelete = async () => {
    if (authedUser?.sub !== project.ownerID) {
      toast({ title: "This project doesn't belong to you!" });
      return;
    }
    await deleteProject(id);
    router.push("/app");
  };

  if(authedUser.sub !== project.ownerID) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {icon ? (
          <>{icon}</>
        ) : (
          <div className="font-bold text-zinc-600 bg-zinc-200 px-3 py-1.5 rounded">
            <TbSettings />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Config</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={`/app/project/${id}/edit`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Dialog>
              <DialogTrigger className="text-red-500 px-2 pb-2 text-sm">
              Delete
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    You are deleting the project
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
