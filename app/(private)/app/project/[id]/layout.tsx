import React from "react";
import Navbar from "./navbar";
import { getProject } from "@/services/project";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};
export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const {
    id
  } = params;

  const {
    children
  } = props;

  const project = await getProject(id);
  if (!project) return "Couldn't find the project that you are looking for";
  return (
    <div className="flex flex-col gap-7">
      <Navbar project={project} />
      <div>{children}</div>
    </div>
  );
}
