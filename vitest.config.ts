import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./test/setup.ts"],
		include: ["components/**/*.test.{ts,tsx}"],
		css: {
			modules: {
				classNameStrategy: "non-scoped",
			},
		},
	},
});
