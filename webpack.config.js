const path = require('path');

module.exports = {
	entry: './source/client/index.js',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015','react']
                  }
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public')
    },
    devtool: 'source-map',
	watch: true
};
