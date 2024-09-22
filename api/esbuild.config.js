// esbuild.config.js
const { build } = require('esbuild');

build({
    entryPoints: ['./app.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: 'dist/bundle.js',
    platform: 'node',
    target: ['node18'],
}).catch(() => process.exit(1));