import type { MetadataRoute } from "next";
import { listProducts, listCategories } from "@/lib/queries";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/produkte", "/oferta", "/kontakt"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
  }));
  const products = listProducts().map((p) => ({
    url: `${site.url}/produkte/${p.slug}`,
    lastModified: new Date(p.created_at * 1000),
  }));
  const cats = listCategories().map((c) => ({
    url: `${site.url}/produkte?kategori=${c.slug}`,
    lastModified: now,
  }));
  return [...staticRoutes, ...cats, ...products];
}
