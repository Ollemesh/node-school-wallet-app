/*
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	externals: nodeExternals(),
	entry: './source/app.js',
	//target: 'node',

	module: {
		rules: [{
				test: /\.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				loader: 'ignore-loader'
			}
		]
	},
	node: {
		fs: 'empty'
	},
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		modules: [
			path.resolve(__dirname)
		]
	}
	//libraryTarget: 'umd' // ???????????
};
*/
const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getExternals() {
	return fs.readdirSync('node_modules')
		.concat(['react-dom/server'])
		.filter((mod) => mod !== '.bin')
		.reduce((externals, mod) => {
			externals[mod] = `commonjs ${mod}`;
			return externals;
		}, {});
}

module.exports = [
	{
		entry: {
			index: './source/views/index.src.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: 'css-loader'
					})
				}
			]
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'public')
		},
		plugins: [
			new ExtractTextPlugin('[name].css')
		],
		watch: true
	},
	{
		entry: {
			index: './source/views/index.server.src.js'
		},
		target: 'node',
		externals: getExternals(),
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.css$/,
					loader: 'ignore-loader'
				}
			]
		},
		output: {
			filename: '[name].server.js',
			path: path.resolve(__dirname, 'source/views'),
			libraryTarget: 'umd'
		},
		watch: true
	}
];
