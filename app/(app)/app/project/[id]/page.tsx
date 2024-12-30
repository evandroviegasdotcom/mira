export const revalidate = 0
import { getProject } from "@/services/project";
import Image from "next/image";
import React from "react";
import ProvidersWrapper from "./ProvidersWrapper";
import New from "./components/tasks/new";
import Views from "./components/tasks/views";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await getProject(id);
  if (!project) return;
  return (
    <ProvidersWrapper project={project}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-600 font-semibold">
          {project.description}
        </p>
        <div className="relative w-full h-[400px]">
          <Image
            src={project?.cover}
            fill
            className="object-cover rounded"
            alt="Cover"
          />
        </div>
          <div className="space-y-6">
          <New />
          <Views projectId={project.id} />
          </div>
      </div>
    </ProvidersWrapper>
  );
}
