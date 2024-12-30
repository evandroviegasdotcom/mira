"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import React, { useState } from "react";
import { LuPlus } from "react-icons/lu";
import Form from "./form";
import { Project } from "@prisma/client";

export default function New({ project }: { project: Project }) {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex md:flex-row flex-col items-start md:items-center md:justify-between gap-3">
      <span className="small-title">Tasks</span>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerTrigger>
          <Button variant="outline" asChild onClick={() => setIsOpen(true)}>
            <div>
              <span>Create a new one</span>
              <LuPlus />
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-10">
            <DrawerHeader>
                <DrawerTitle>Create a new task</DrawerTitle>
                <Form project={project} onClose={() => setIsOpen(false)} />
            </DrawerHeader>
            
        </DrawerContent>
      </Drawer>
    </div>
  );
}
