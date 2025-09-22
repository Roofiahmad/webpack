const express = require("express");
const path = require("path");
const app = express();
const expressStaticGzip = require("express-static-gzip");

if (process.env.NODE_ENV === "dev") {
  console.log("development mode");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const configuration = require("./webpack/webpack.dev.config");
  const webpack = require("webpack");
  const webpackCompiler = webpack(configuration);
  app.use(
    webpackDevMiddleware(webpackCompiler, configuration.devServer.devMiddleware)
  );

  const webpackHotMiddleware = require("webpack-hot-middleware");
  app.use(webpackHotMiddleware(webpackCompiler));
}

app.get("/", (req, res) => {
  const absoluteHtmlPath = path.resolve(__dirname, "./dist/index.html");
  res.sendFile(absoluteHtmlPath);
});

app.use("/static", expressStaticGzip(path.resolve(__dirname, "./dist")));

app.listen(3000, () => {
  console.log("server run on port 3000");
});
