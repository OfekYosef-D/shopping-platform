import { useQuery } from "@tanstack/react-query";

// In a real app, this would fetch from a Server Action or API route
// that returns the user's cart items from the database.
export async function fetchCart() {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export function useCartQuery() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
