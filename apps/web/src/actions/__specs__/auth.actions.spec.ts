import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, register, logout } from "../auth.actions";
import { redirect } from "next/navigation";
import { db } from "@/db";

// Mock Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock Drizzle db
vi.mock("@/db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onConflictDoNothing: vi.fn(),
      })),
    })),
  },
}));

import { createClient } from "@/lib/supabase/server";

function makeMockSupabase(overrides: Record<string, unknown> = {}) {
  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: { id: "user-123", email: "test@example.com" } }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      ...overrides,
    },
  };
}

describe("Auth Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should login with valid credentials", async () => {
    const mockSupabase = makeMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");

    await login(null, formData);

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(redirect).toHaveBeenCalledWith("/products");
  });

  it("should reject login with invalid credentials", async () => {
    const mockSupabase = makeMockSupabase({
      signInWithPassword: vi.fn().mockResolvedValue({
        error: { message: "Invalid login credentials" },
      }),
    });
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "wrongpassword");

    const result = await login(null, formData);

    expect(result).toEqual({ success: false, message: "Invalid login credentials" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should register a new user", async () => {
    const mockSupabase = makeMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const formData = new FormData();
    formData.set("name", "Jane Doe");
    formData.set("email", "jane@example.com");
    formData.set("password", "securepass");

    await register(null, formData);

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "securepass",
    });
    expect(db.insert).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/products");
  });

  it("should reject duplicate email registration", async () => {
    const mockSupabase = makeMockSupabase({
      signUp: vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: "User already registered" },
      }),
    });
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const formData = new FormData();
    formData.set("name", "Jane Doe");
    formData.set("email", "existing@example.com");
    formData.set("password", "securepass");

    const result = await register(null, formData);

    expect(result).toEqual({ success: false, message: "User already registered" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should logout and clear session", async () => {
    const mockSupabase = makeMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await logout();

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
