import { defaultUrl } from "./src/lib/utils";

export default {
	"jadebook-platform": {
		input: `${defaultUrl}/api/doc`,
		output: {
			target: "./src/api-client.ts",
			baseUrl: `${defaultUrl}`,
			client: "react-query",
			httpClient: "fetch",
			biome: true,
			override: {
				query: {
					useInfinite: true,
				},
			},
		},
	},
};
