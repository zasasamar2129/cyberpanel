// Fix: To resolve "Cannot find namespace 'JSX'", import `ReactElement`
// and use it instead of the global `JSX.Element`.
import type { ReactElement } from 'react';

export interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  isBanned: boolean;
}

export interface AdminUser {
  id: number;
  username: string;
  role: 'admin' | 'moderator';
  avatar: string;
  lastLogin: string;
}

export interface SystemStats {
  ram: number; // percentage
  storage: number; // percentage
  cpu: number; // percentage
  connections: number;
  ram_used_mb: number;
  ram_total_mb: number;
  storage_used_gb: number;
  storage_total_gb: number;

  network_speed_mbps: number;
  network_max_mbps: number;
  status: 'Online' | 'Offline';
  pid: number;
}


export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export type Page = 'home' | 'dashboard' | 'users' | 'settings' | 'logs' | 'broadcast' | 'admins' | 'profile' | 'terminal';

export interface NavItem {
  id: Page;
  label: string;
  icon: ReactElement;
}
