import { defineConfig } from 'vite';
import path from 'path';
import viteImagemin from 'vite-plugin-imagemin';
import svgSprite from 'vite-svg-sprite-wrapper';
import Spritesmith from 'vite-plugin-spritesmith';

export default defineConfig(({ command }) => {
    return {
        base: '/',
        root: path.resolve(__dirname, 'src'),
        build: {
            minify: true,
            cssCodeSplit: true,
            terserOptions: {
                format: {
                    comments: true,
                },
            },
            css: {
                minify: true,
            },
            outDir: '../build',
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/js/[name].[hash].js',
                    chunkFileNames: 'assets/js/[name].[hash].js',
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name.endsWith('.css')) {
                            return 'assets/css/[name].[hash][extname]';
                        } else if (assetInfo.name.endsWith('.js')) {
                            return 'assets/js/[name].[hash][extname]';
                        } else if (
                            ['.jpeg', '.jpg', '.png', '.gif', '.svg'].some(
                                (ext) => assetInfo.name.endsWith(ext),
                            )
                        ) {
                            return 'assets/images/[name].[hash][extname]';
                        } else if (
                            ['.mp4', '.webm'].some((ext) =>
                                assetInfo.name.endsWith(ext),
                            )
                        ) {
                            return 'assets/video/[name].[hash][extname]';
                        } else if (
                            ['.eot', '.woff', '.woff2', '.ttf', '.otf'].some(
                                (ext) => assetInfo.name.endsWith(ext),
                            )
                        ) {
                            return 'assets/fonts/[name].[hash][extname]';
                        } else {
                            return 'assets/[name].[hash][extname]';
                        }
                    },
                },
            },
        },
        server: {
            port: 3000,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@js': path.resolve(__dirname, 'src/js'),
            },
        },
        plugins: [
            svgSprite({
                icons: 'src/assets/images/for_svg_sprite/**/*.svg',
                outputDir: 'src/assets/images/icons',
                fileName: 'sprite.svg',
            }),
            Spritesmith({
                watch: command === 'serve',
                src: {
                    cwd: path.resolve(
                        __dirname,
                        'src/assets/images/for_png_sprite',
                    ),
                    glob: '*.png',
                },
                target: {
                    image: path.resolve(
                        __dirname,
                        'src/assets/images/template/sprite.png',
                    ),
                    css: [
                        [
                            path.resolve(
                                __dirname,
                                'src/styles/base/_spritepng.scss',
                            ),
                            {
                                format: 'handlebars_based_template',
                            },
                        ],
                    ],
                },
                apiOptions: {
                    cssImageRef: '../images/template/sprite.png',
                },
                customTemplates: {
                    handlebars_based_template: path.resolve(
                        __dirname,
                        'src/styles/base/scss.handlebars',
                    ),
                },
            }),
            viteImagemin({
                gifsicle: {
                    optimizationLevel: 8,
                    interlaced: false,
                },
                optipng: {
                    optimizationLevel: 8,
                },
                mozjpeg: {
                    quality: 80,
                },
                svgo: {
                    plugins: [
                        {
                            name: 'removeViewBox',
                        },
                        {
                            name: 'removeEmptyAttrs',
                            active: false,
                        },
                    ],
                },
            }),
        ],
    };
});
