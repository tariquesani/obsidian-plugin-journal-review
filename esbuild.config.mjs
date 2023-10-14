import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import {copy} from 'esbuild-plugin-copy';

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["src/main.ts", "src/styles.css"],
	bundle: true,
	alias: {
		react: "preact/compat",
		"react-dom/test-utils": "preact/test-utils",
		"react-dom": "preact/compat", // Must be below test-utils
		"react/jsx-runtime": "preact/jsx-runtime",
	},
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins,
	],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outdir: "dist",
	plugins: [
		copy({
			// this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
			// if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
			// resolveFrom: 'cwd',
			assets: {
				from: ['./manifest.json'],
				to: ['./manifest.json'],
			},
			watch: true,
		}),
	]
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}
