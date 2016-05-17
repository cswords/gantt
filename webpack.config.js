var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: [
  		"webpack/hot/dev-server",
		"./sources/app.js",
	],

	output: {
		filename: "./app/app.js",
	},

	module: {
		loaders: [
			/*{
				test: /\.scss$/,
				loader: "style!css!sass"
			},*/
			{
				test: /\.js(x?)$/,
				exclude: /node_modules/,
				loader: "babel-loader",
			},
			{
				test: /\.scss/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
			}
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin("./app/styles.css"),
	],
}