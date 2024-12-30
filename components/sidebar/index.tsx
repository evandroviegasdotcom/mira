import React from "react";
import Logo from "../Logo";
import Links from "./links";
import Projects from "./projects";
import Profile from "./Profile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";

export default function Sidebar() {
  return (
    <React.Fragment>
      <div className="hidden md:inline fixed left-0 top-0 bottom-0 md:w-[350px]  bg-secondary">
        <div className="flex flex-col justify-between h-full p-10">
          <div className="flex flex-col justify-between gap-6">
            <Logo small />
            <Projects />
            <Links />
          </div>
          <Profile />
        </div>
      </div>
      <div className="flex items-center justify-between md:hidden p-6 border-b border-b-secondary">
        <Logo small />
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger>
              <Menu className="bg-secondary text-zinc-600 p-1 rounded" />
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between">
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col justify-between gap-6">
                  <Logo small />
                  <Projects />
                  <Links />
                </div>
                <Profile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </React.Fragment>
  );
}
