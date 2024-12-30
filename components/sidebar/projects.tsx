import { getAuth } from "@/services/auth";
import { getUserProjects } from "@/services/project";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Config from "@/components/Config";
import { PiDotsThreeVertical } from "react-icons/pi";

export default async function Projects() {
  const session = await getAuth();
  const authedUser = session.user
  if (!authedUser) return;
  const projects = await getUserProjects(authedUser?.sub, 3);
  const hasProjects = projects.length > 0;

  return (
    <div className="flex flex-col gap-3 ">
      <span className="small-title">PROJECTS</span>
      <Link
        href="/app/new"
        className="flex justify-center items-center border py-3 text-sm rounded-none font-medium text-zinc-700"
      >
        Create a new Project
      </Link>

      {hasProjects ? (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group w-full flex justify-between p-4 border rounded relative"
            >
              <div className="flex gap-4 items-center">
                <Image src={project.icon} width={25} height={25} alt="Icon" />

                <Link
                  href={`/app/project/${project.id}`}
                  className="font-medium group-hover:underline"
                >
                  {project.name}
                </Link>
              </div>
              <Config authedUser={authedUser} project={project} icon={<PiDotsThreeVertical />} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
