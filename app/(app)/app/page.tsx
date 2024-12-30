import { getAuth } from "@/services/auth";
import { getUserProjects } from "@/services/project";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TbPlus, TbUsers } from "react-icons/tb";

export default async function Page() {
  const session = await getAuth();
  const user = session.user;
  if (!user) return null;
  const projects = await getUserProjects(user?.sub);
  return (
    <div className="md:grid md:grid-cols-3 flex flex-col gap-4">
      <Link href="/app/new" className="w-full h-full border border-dashed flex justify-center items-center">
      <div className="flex flex-col justify-center items-center text-center gap-3 text-zinc-500 font-bold min-h-[200px]">
        <TbPlus className="text-3xl" />
        <span className="text-xl">Create a new Project</span>
      </div>
      </Link>
      {projects.map((project) => (
        <Link href={`/app/project/${project.id}`} key={project.id} className="border transition-all hover:bg-secondary rounded ">
          <div className="w-full h-44 relative">
            <Image fill src={project.cover} alt="Cover" className="rounded" />
          </div>
          <div className="p-5  rounded-b space-y-1 ">
            <p className="text-2xl font-bold text-zinc-800">
              {project.name}
            </p>
            <p className="text-xs text-zinc-500 ">{project.description}</p>
            <div className="flex items-center text-xs text-zinc-500">
                <TbUsers />
                {project.membersIDs.length}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
