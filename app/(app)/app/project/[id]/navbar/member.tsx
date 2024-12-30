import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { TbUsers } from "react-icons/tb";
import Image from "next/image";
import { User } from "@prisma/client";

export default function Members({ members }: { members: User[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 small-title bg-zinc-200 px-3 py-1.5 rounded">
          <span>Members ({members.length})</span>
          <TbUsers />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              {members.map((member) => (
                <CommandItem
                  key={member.id}
                  value={member.email}
                  className="flex gap-3 items-center justify-between"
                >
                  <Image
                    src={member.picture}
                    width={25}
                    height={25}
                    alt="Member"
                    className="object-cover rounded-full"
                  />
                  <span className="text-sm">{member.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
