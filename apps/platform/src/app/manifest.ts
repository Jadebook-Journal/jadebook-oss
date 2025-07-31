import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Jadebook OSS",
		short_name: "Jadebook OSS",
		description: "Jadebook OSS is a self-hosted journaling platform.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/icon",
				sizes: "1024x1024",
				type: "image/png",
			},
		],
	};
}
