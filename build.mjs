// @ts-check

import { build } from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  plugins: [
    esbuildPluginTsc(),
  ],
});
