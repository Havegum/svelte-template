import autoprefixer from 'autoprefixer';
import autoPreprocess from 'svelte-preprocess';
import postcssPresetEnv from 'postcss-preset-env';

import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import svelte from 'rollup-plugin-svelte';
import alias from '@rollup/plugin-alias';
import strip from '@rollup/plugin-strip';
import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';
import yaml from '@rollup/plugin-yaml';
import copy from 'rollup-plugin-copy';
import dsv from '@rollup/plugin-dsv';

import { maybeDate } from './src/utils/date.js';
import json from './src/utils/rollup-plugin/json.js'; // Custom plugin for .topo- and .geojson support

const production = !process.env.ROLLUP_WATCH;

const postcssPlugins = [
	postcssPresetEnv({
		autoprefixer: { grid: true },
		browsers: 'last 2 versions',
		stage: 0,
	}),
	autoprefixer(),
	// TODO: remove unused css variables with 2 passes of regex.
	// TODO: dynamically create @font-face rules with postcss-font-magician and custom foundry

	// Custom postcss plugins in rollup is tough since the postcss version is outdated
	// Blocking issue is solved by this PR:
	// https://github.com/egoist/rollup-plugin-postcss/pull/325

	// REMINDER: Update autoprefixer when this PR merges ^

	// PostCSS plugin creation guide here:
	// https://github.com/postcss/postcss/blob/master/docs/writing-a-plugin.md
];


export default {
	input: 'src/main.js',

	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'build/bundle.hash.js'
	},

	onwarn: function (warning, warn) {
		// Ignore these warnings
		if (warning.code === 'CIRCULAR_DEPENDENCY') return;
		warn(warning);
	},

	plugins: [
		copy({
			targets: [{ src: 'public/!(*.css)', dest: 'build' }],
		}),

		alias({
			resolve: ['.js', '.svelte'],
			entries: { '@': __dirname + '/src' }
		}),

		replace({
			process: JSON.stringify({
				env: { dev: !production }
			})
		}),

		svelte({
			dev: !production,
			preprocess: autoPreprocess(),
			emitCss: true,
			css: false, // Emit CSS to be handled by postcss
		}),

		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),

		babel({
			extensions: ['.js', '.mjs', '.html', '.svelte'],
			include: ['src/**', 'node_modules/svelte/**'],
		}),

		yaml(),
		json(),
		dsv({
			processRow: (row, id) => {
				Object.keys(row).forEach(key => {
					const value = row[key];
					row[key] = isNaN(+value) ? maybeDate(value) : +value;
				});
			}
		}),

		commonjs(),
		postcss({
			minimize: production,
			sourceMap: !production,
			plugins: postcssPlugins,
			extract: 'bundle.hash.css',
		}),

		!production && serve({ contentBase: ['build'], port: 5000 }),
		!production && livereload({ watch: 'build', port: 35729 }),

		production && strip({
			include: '**/*.(js|mjs|html|svelte)',
			functions: ['console.log']
		}),

		// `toplevel: false` to fix an issue where terser redeclares variables.
		// https://github.com/TrySound/rollup-plugin-terser/issues/40
		production && terser({ toplevel: false })
	]
};
