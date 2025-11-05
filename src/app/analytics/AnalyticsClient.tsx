"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnalyticsPageContent from "./AnalyticsPageContent";

const queryClient = new QueryClient();

export default function AnalyticsClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsPageContent />
    </QueryClientProvider>
  );
}
