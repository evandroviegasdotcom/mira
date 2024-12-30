import React from "react";
import Add from "./add";
import { FormDescription, FormLabel } from "@/components/ui/form";
import List from "./list";

export default function Members() {
  return (
    <div className="py-5 space-y-1">
      <FormLabel>Members</FormLabel>

      <FormDescription>Invite members to your project!</FormDescription>
      <div className="space-y-4">
        <Add />
        <List />
      </div>
    </div>
  );
}
