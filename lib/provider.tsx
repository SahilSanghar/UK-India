"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { NavbarProvider } from "./navbar-context";

const queryClient = new QueryClient();

export function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NavbarProvider>
        {children}
      </NavbarProvider>
    </QueryClientProvider>  
  );
}