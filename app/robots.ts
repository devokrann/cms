import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			// disallow: "/private/",
		},
		// sitemap: "https://acme.com/sitemap.xml",
	};
}

// Output
// User-Agent: *
// Allow: /
// Disallow: /private/

// Sitemap: https://acme.com/sitemap.xml
