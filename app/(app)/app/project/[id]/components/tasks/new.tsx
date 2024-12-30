"use client"
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { LuPlus } from "react-icons/lu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Form from "./form";

export default function New() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex md:flex-row flex-col items-start md:items-center md:justify-between gap-3">
      <span className="small-title">Projects</span>
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
            <Form onClose={() => setIsOpen(false)} />
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
