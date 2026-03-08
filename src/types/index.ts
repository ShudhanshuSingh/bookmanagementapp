import { Types } from "mongoose";

// ─── User ────────────────────────────────────────────
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPayload = {
  userId: string;
  email: string;
  name: string;
};

// ─── Book ────────────────────────────────────────────
export type BookStatus = "want-to-read" | "reading" | "completed";

export interface IBook {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  notes: string;
  coverColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookFormData = {
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  notes?: string;
};

// ─── API Response ────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]> | string;
}

// ─── Auth ────────────────────────────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

// ─── Dashboard Stats ─────────────────────────────────
export interface BookStats {
  total: number;
  reading: number;
  completed: number;
  wantToRead: number;
  completedThisMonth: number;
}

// ─── Greeting ────────────────────────────────────────
export interface GreetingData {
  text: string;
  icon: string;
}
