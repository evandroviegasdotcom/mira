"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import schema from "./schema";
import { Textarea } from "@/components/ui/textarea";
import Cover from "./Cover";
import { createContext, useContext, useState } from "react";
import Members from "./members";
import { User } from "@prisma/client";
import { createProject, editProject } from "@/services/project";
import { uploadCover } from "@/services/cover";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { CompleteProject } from "@/types/project";
import { AiOutlineLoading } from "react-icons/ai";

export type Creative = {
  cover: File | string;
  icon: string;
};

type Context = {
  members: User[];
  creative: Creative;
  setMembers: (members: User[]) => void;
  setCreative: (creative: Creative) => void;
  project: CompleteProject | undefined;
  isEditing: boolean;
};
const FormContext = createContext({} as Context);
export function useContextForm() {
  return useContext(FormContext);
}

const defaultEmoji =
  "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4b4.png";
const defaultCover = `https://avatar.vercel.sh/${Date.now()}.png`;

export default function Form({ project }: { project?: CompleteProject }) {
  const isEditing = !!project;
  const [members, setMembers] = useState<User[]>(project?.members || []);

  const [creative, setCreative] = useState<Creative>({
    cover: project?.cover || defaultCover,
    icon: project?.icon || defaultEmoji,
  });
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isEditing
      ? { name: project.name, description: project.description }
      : {},
  });

  async function onSubmit(values: z.infer<typeof schema>) {

    setIsLoading(true)
    const coverUrl = await uploadCover(creative?.cover);
    if (!coverUrl)
      return toast({ title: "An error occured trying to upload the cover" });
    const session = await getAuth();
    const user = session.user;
    if (!user) return toast({ title: "Not authenticated" });
    const membersIDs = members.map((m) => m.id);
    const data = {
      cover: coverUrl,
      icon: creative.icon,
      description: values.description || "",
      name: values.name,
      ownerID: session.user.sub,
      membersIDs: isEditing ? membersIDs : [user.sub, ...membersIDs],
    };

    if (isEditing) {
      const session = await getAuth();
      const user = session.user;

      if (user?.sub !== project.ownerID) {
        toast({ title: "This project doesn't belong to you!" });
        return;
      }
      await editProject({ ...data, id: project.id });
    } else {
      await createProject(data);
    }
    router.push("/app");
    setIsLoading(false)
  }

  return (
    <FormContext.Provider
      value={{ members, setMembers, setCreative, creative, project, isEditing }}
    >
      <FormComp {...form}>
        <form className="space-y-4 w-full">
          <h4 className="text-4xl font-bold text-zinc-700">
            {isEditing ? "Edit your project" : "Create a new project"}
          </h4>
          <div className="py-5 space-y-1">
            <FormLabel>Cover</FormLabel>
            <Cover />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormDescription>Give a name to your project!</FormDescription>

                <FormControl className="w-full">
                  <Input
                    placeholder="Ex: My project"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormDescription>
                  Give more info about your project!
                </FormDescription>
                <FormControl>
                  <Textarea placeholder="Ex: Football project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Members />
          <Button type="button" className="flex items-center gap-1.5" onClick={form.handleSubmit(onSubmit)}>
            <span>
            Create
            </span>
            {isLoading ? <AiOutlineLoading className="animate-spin" /> : null}
            
          </Button>
        </form>
      </FormComp>
    </FormContext.Provider>
  );
}
