import React from "react";
import Navbar from "./navbar";
import { getProject } from "@/services/project";

type LayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};
export default async function Layout({
  children,
  params: { id },
}: LayoutProps) {
  const project = await getProject(id);
  if (!project) return "Couldn't find the project that you are looking for";
  return (
    <div className="flex flex-col gap-7">
      <Navbar project={project} />
      <div>{children}</div>
    </div>
  );
}
