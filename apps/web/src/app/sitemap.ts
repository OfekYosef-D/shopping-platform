import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env/public";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = ["", "/products", "/cart", "/login", "/register", "/dashboard"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
