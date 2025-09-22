const common = require("./webpack.common.config.js");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const glob = require("glob");
const path = require("path");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
  entry: "./src/js/index.js",
  mode: "production",
  // devtool: "source-map",
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ["default", { discardComments: { removeAll: true } }],
        },
      }),
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminMinify,
      //     options: {
      //       plugins: [
      //         ["imagemin-mozjpeg", { quality: 40 }],
      //         ["imagemin-pngquant", { quality: [0.65, 0.9], speed: 4 }],
      //         ["imagemin-gifsicle", { interlaced: true }],
      //         [
      //           "imagemin-svgo",
      //           {
      //             plugins: [
      //               {
      //                 name: "preset-default",
      //                 params: {
      //                   overrides: {
      //                     removeViewBox: false,
      //                     addAttributesToSVGElement: {
      //                       params: {
      //                         attributes: [
      //                           { xmlns: "http://www.w3.org/2000/svg" },
      //                         ],
      //                       },
      //                     },
      //                   },
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       ],
      //     },
      //   },
      //   generator: [
      //     {
      //       type: "asset",
      //       preset: "webp-custom-name",
      //       implementation: ImageMinimizerPlugin.imageminGenerate,
      //       options: {
      //         plugins: ["imagemin-webp"],
      //       },
      //     },
      //   ],
      // }),
    ],
    splitChunks: {
      // FIRST STRATEGY => split base on specifict dependency
      // cacheGroups: {
      //   jquery: {
      //     test: /[\\/]node_modules[\\/]jquery[\\/]/,
      //     chunks: "initial",
      //     name: "jquery",
      //   },
      //   bootstrap: {
      //     test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
      //     chunks: "initial",
      //     name: "bootstrap",
      //   },
      // },

      // SECOND STRATEGY => split based on size
      // chunks: "all",
      // maxSize: 140000,
      // minSize: 50000,
      // name(module, chunks, cacheGroupKey) {
      //   const filePathAsArray = module.identifier().split("/");
      //   return filePathAsArray[filePathAsArray.length - 1];
      // },

      // split node modules with main app
      // chunks: "all",
      // maxSize: Infinity,
      // minSize: 0,
      // cacheGroups: {
      //   node_modules: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: "node_modules",
      //   },
      // },

      // split for each dependency
      // chunks: "all",
      // maxSize: Infinity,
      // minSize: 0,
      // cacheGroups: {
      //   node_modules: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name(module) {
      //       const packageName = module.context.match(
      //         /[\\/]node_modules[\\/](.*?)([\\/]|$)/
      //       )[1];
      //       return packageName;
      //     },
      //   },
      // },

      chunks: "all",
      maxSize: Infinity,
      minSize: 2000,
      cacheGroups: {
        lodash: {
          test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
          name: "lodash-es",
          priority: 2,
        },
        emotion: {
          test: /[\\/]node_modules[\\/]@emotion[\\/]/,
          name: "emotion",
          priority: 2,
        },
        node_modules: {
          test: /[\\/]node_modules[\\/]/,
          name: "node_modules",
          chunks: "initial",
        },
        async: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "async",
          name(module, chunks) {
            return chunks.map((chunk) => chunk.name).join("-");
          },
        },
      },
    },
    runtimeChunk: "single",
  },
  output: {
    filename: "js/[name].[contenthash:12].js",
    publicPath: "/static/",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                silenceDeprecations: ["import"],
                quiteDeps: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "./images/[name].[contenthash:12][ext]",
        },

        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                quality: 40,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:12].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "../src")}/**/*`, {
        nodir: true,
      }),
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css)$/,
    }),
  ],
});
