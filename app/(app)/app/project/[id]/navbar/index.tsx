import Image from "next/image";
import React from "react";
import Members from "./member";
import Config from "../../../../../../components/Config";
import { ProjectWithMembers } from "@/types/project";
import { getAuth } from "@/services/auth";


export default async function Navbar({
  project,
}: {
  project: ProjectWithMembers;
}) {
  const session = await getAuth()
  const authedUser = session.user
  if(!authedUser) return null
  return (
    <div className="p-4 bg-secondary flex justify-between">
      <div className="flex items-center gap-2">
        <Image src={project.icon} width={35} height={35} alt="Icon" />
        <span className="text-lg font-bold text-zinc-800">{project.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <Members members={project.members} />
        <Config project={project} authedUser={authedUser} />
      </div>
    </div>
  );
}
