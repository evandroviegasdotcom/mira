import Sidebar from "@/components/sidebar";
import React from "react";
import ProvidersWrapper from "../ProvidersWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProvidersWrapper>
      <div className="min-h-screen flex md:flex-row flex-col">
        <div className="md:w-[350px] w-auto">
          <Sidebar />
        </div>
        <div className="md:p-24 px-12 py-12 w-full">{children}</div>
      </div>
    </ProvidersWrapper>
  );
}
