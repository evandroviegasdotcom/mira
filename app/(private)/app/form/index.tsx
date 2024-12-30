"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Form as FormComp,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import schema from "./schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import Cover from "./cover";
import Members from "./members";
import { User } from "@prisma/client";
import { uploadCover } from "@/services/cover";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "@/services/auth";
import { createProject, editProject } from "@/services/project";
import { useRouter } from "next/navigation";
import { CompleteProject } from "@/types/project";

export const defaultCover = `https://avatar.vercel.sh/e`;
const defaultEmoji = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4a4.png`;

type FormContext = {
  members: User[];
  setMembers: (members: User[]) => void;
  project: undefined | CompleteProject
};
const FormContext = createContext({} as FormContext);

export function useFormContext() {
  return useContext(FormContext);
}

type FormProps = {
  project?: CompleteProject;
};

export default function Form(props: FormProps) {
  const { project } = props;
  const isEditing = !!project;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isEditing
      ? {
          name: project.name,
          description: project.description,
        }
      : {},
  });

  const [isLoading, setIsLoading] = useState(false);

  const [cover, setCover] = useState<string | File>(project?.cover || defaultCover);
  const [icon, setIcon] = useState(project?.icon || defaultEmoji);
  
  const [members, setMembers] = useState<User[]>(project?.members || []);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsLoading(true);

      const coverUrl = await uploadCover(cover);
      if (!coverUrl)
        return toast({ title: "An error occured trying to upload the cover" });

      const session = await getAuth();
      const user = session.user;
      if (!user) return toast({ title: "Not authenticated" });

      const membersIDs = members.map((m) => m.id);

      const projectData = {
        cover: coverUrl,
        icon,
        description: values.description || "",
        name: values.name,
        ownerID: session.user.sub,
        membersIDs,
      }
    if(isEditing ) {
      const session = await getAuth()
      const user = session.user
      if (user?.sub !== project.ownerID) {
        toast({ title: "This project doesn't belong to you" })
        return
      }

      await editProject({ id: project.id, ...projectData })
    } else {
      await createProject(projectData);
    }


      toast({ title: "A new project was created successfully!" });
      router.push("/app");

      // created project
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormContext.Provider value={{ members, setMembers, project }}>
      <FormComp {...form}>
        <form className="space-y-4 w-full">
          <h4 className="text-4xl font-bold text-zinc-700">
            {isEditing ? 'Edit your project' : 'Create a new project'}
          </h4>
          <div className="py-5 space-y-1">
            <FormLabel>Cover</FormLabel>
            <Cover
              cover={cover}
              setCover={setCover}
              icon={icon}
              setIcon={setIcon}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl className="w-full">
                  <Input
                    placeholder="Ex: My Project"
                    className="w-full"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Give a name to your project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Youtube Project"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Give more info about your project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Members />
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-1.5"
          >
            <span>{isEditing ? 'Edit' : 'Create'}</span>
            {isLoading ? <AiOutlineLoading className="animate-spin" /> : null}
          </Button>
        </form>
      </FormComp>
    </FormContext.Provider>
  );
}
