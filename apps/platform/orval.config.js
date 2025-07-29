export default {
	"jadebook-platform": {
		input: `http://localhost:3000/api/doc`,
		output: {
			target: "./src/api-client.ts",
			baseUrl: `/`,
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
