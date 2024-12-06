import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';

/**
 * @typedef {import('esbuild').Plugin} Plugin
 */

/**
 * @param {Object} options
 * @param {string} options.configFile
 * @returns {Plugin}
 */
export function postcssPlugin() {
    return {
        name: 'postcss-plugin',
        setup(build) {
            build.onLoad({ filter: /.\.css$/ }, async (args) => {
                const css = await readFile(args.path, { encoding: 'utf-8' });
                const result = await postcss(
                    [
                        postcssImport(),
                        tailwindcss({ config: './tailwind.config.js' }),
                    ])
                    .process(css, { from: args.path })
                return {
                    loader: 'css',
                    contents: result.css
                }
            })
        }
    }
}

await build({
    entryPoints: ['./tailwind.css'],
    bundle: true,
    logLevel: 'warning',
    outfile: './output.css',
    plugins: [postcssPlugin({})]
});