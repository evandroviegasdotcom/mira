import React from "react";
import { useFormContext } from "..";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

export default function List() {
  const { members, setMembers, project } = useFormContext();
  const {toast } = useToast()
  const removeMember = (member: User) => {

    if(project?.ownerID === member.id) return toast({ title: "You can't remove the owner" }) 
    const nMembers = members.filter(m => m.id !== member.id)
    setMembers(nMembers)
  }
  return (
    <div className="flex flex-col w-full bg-secondary p-6 rounded">
      {members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between py-4 border-b"
          >
            <div className="flex items-center gap-8">
              <Image
                alt="Member picture"
                width={40}
                height={40}
                src={member.picture}
                className="rounded-full object-cover"
              />
              <div className="flex items-center gap-4">
                <span className="small-title">{member.name}</span>
                <span className="text-zinc-600 font-bold text-xs">
                  {member.email}
                </span>
              </div>
            </div>

            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <span className="text-xs underline text-zinc-400 hover:text-red-400">
                    Remove
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>You are removing {member.name} from the project members list</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeMember(member)}>Remove anyways</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))
      ) : (
        <div className="small-title text-center">
          You hace no members added to your project
        </div>
      )}
    </div>
  );
}
