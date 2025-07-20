import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		// Warning: This allows production builds to successfully complete even if nextjs lint fails
		// We use biome for linting now so we shouldn't need this
		ignoreDuringBuilds: true,
	},
	experimental: {
		reactCompiler: true,
	},
};

export default nextConfig;
