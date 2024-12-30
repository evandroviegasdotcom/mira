import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import Image from "next/image";

import React from "react";
import { TbUsers } from "react-icons/tb";

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
                  className="flex gap-3 items-center"
                >
                  <Image
                    src={member.picture}
                    width={25}
                    height={25}
                    alt="Member img"
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
