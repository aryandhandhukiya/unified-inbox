// app/analytics/page.tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    refetchInterval: 60000, // refresh every minute
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading analytics...
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">
        Unified Inbox Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Messages by Channel */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-medium mb-4 text-gray-700">
            Messages by Channel
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.channels}
                dataKey="count"
                nameKey="channel"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.channels.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Direction Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-medium mb-4 text-gray-700">
            Inbound vs Outbound
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.direction}>
              <XAxis dataKey="direction" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Summary */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-medium mb-4 text-gray-700">
            Message Status Summary
          </h2>
          <ul className="space-y-2">
            {data.status.map((s: any) => (
              <li
                key={s.status}
                className="flex justify-between border-b border-gray-100 pb-1"
              >
                <span className="capitalize text-gray-800">{s.status}</span>
                <span className="font-medium text-gray-800">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
