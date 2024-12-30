"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProject } from "@/services/project";
import { ProjectWithMembers } from "@/types/project";
import { User } from "@/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { TbSettings } from "react-icons/tb";

type ConfigProps = {
  project: ProjectWithMembers;
  authedUser: User;
};
export default function Config({ project, authedUser }: ConfigProps) {
  const { id } = project;
  const router = useRouter();

  if (authedUser.sub !== project.ownerID) return null;
  const handleDelete = async () => {
    await deleteProject(id);
    router.push("/app");
  };
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <div className="font-bold text-zinc-600 bg-zinc-200 px-3 py-1.5 rounded">
        <TbSettings />
            </div>
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
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete anyways
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
