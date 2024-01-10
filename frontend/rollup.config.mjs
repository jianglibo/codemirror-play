// rollup.config.mjs
// import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// import multi from '@rollup/plugin-multi-entry';
import buble from 'rollup-plugin-buble';
import sizes from 'rollup-plugin-sizes';
// import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const name = "cm6Shell"
export default {
	input: 'src/index.ts',
	external: [],
	output: [
		{
			file: 'public/dist/bundle.js',
			format: 'iife',
			name,
			globals: {},
		},
		{
			file: 'dist/bundle.min.js',
			format: 'iife',
			name,
			globals: {},
			plugins: [terser()]
		}
	],
	plugins: [typescript(), nodeResolve(), commonjs(), sizes()]
};
// , html(), buble(), sizes(), json(),, nodeResolve(),nodePolyfills(),, multi()
// buble({ transforms: { dangerousForOf: true } }),