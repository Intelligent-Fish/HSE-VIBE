export type Mode = "deep" | "fast";
export type Tab = "dashboard" | "modes" | "results" | "settings" | "logs";
export type Status = "idle" | "checking" | "running" | "error";

export interface LogEntry {
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

export interface ResultItem {
  id: number;
  name: string;
  status: "success" | "error";
  responseTime: number;
  action: string;
}