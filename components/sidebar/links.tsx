import Link from "next/link";
import React from "react";
import { LuCheckCircle2 } from "react-icons/lu";
import { PiHouseBold } from "react-icons/pi";
import { TbUsers } from "react-icons/tb";

export default function Links() {
  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <Link key={link.label} href={link.route}>
          <li className="flex items-center gap-3 text-zinc-700 font-semibold text-lg">
            {link.icon}
            {link.label}
          </li>
        </Link>
      ))}
    </ul>
  );
}

export const links = [
  { label: "Home", icon: <PiHouseBold />, route: "/app" },
  { label: "My tasks", icon: <LuCheckCircle2 />, route: "/tasks" },
  { label: "Members", icon: <TbUsers />, route: "/members" },
];
