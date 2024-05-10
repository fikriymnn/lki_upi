import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://lablkiupi.com";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/contact", "/layanan", "/analisis"],
      disallow: [
        "/admin",
        "/login?prevRoute=/layanan",
        "/admin/dashboard/admin",
        "/admin/dashboard/admin/order",
        "/admin/dashboard/admin/history_order",
        "/admin/dashboard/admin/user",
        "/admin/dashboard/admin/report",
        "/admin/dashboard/operator",
        "/admin/dashboard/pj",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
