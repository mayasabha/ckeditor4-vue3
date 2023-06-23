/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

import * as path from 'path';
import webpack from 'webpack';
import TerserWebpackPlugin from 'terser-webpack-plugin';

export default [
	createConfig( 'ckeditor.js' ),
	createConfig( 'legacy.js', [
		[ '@babel/preset-env',
			{
				useBuiltIns: 'usage',
				corejs: 3,
				targets: {
					browsers: [
						'last 2 versions',
						'ie 11'
					],
					node: 10
				}
			}
		]
	], [ 'core-js/es/promise' ] )
];

function createConfig( filename, presets = [], polyfills = [] ) {
	return {
		mode: 'production',
		devtool: 'source-map',

		performance: {
			hints: false
		},

		entry: [ ...polyfills, path.resolve( './', 'src', 'index.js' ) ],

		output: {
			filename,
			library: 'CKEditor',
			path: path.resolve( './', 'dist' ),
			libraryTarget: 'umd',
			libraryExport: 'default'
		},

		optimization: {
			minimizer: [
				new TerserWebpackPlugin( {
					terserOptions: {
						output: {
							// Preserve license comments.
							comments: /^!/
						}
					}
				} )
			]
		},

		plugins: [
			new webpack.BannerPlugin( {
				banner: `/*!*
* @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
* For licensing, see LICENSE.md.
*/`,
				raw: true
			} ),
		],

		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
					exclude: /node_modules/,
				}
			]
		},

		externals: {
			vue: {
				commonjs: 'vue',
				commonjs2: 'vue',
				amd: 'vue',
				root: 'Vue',
			},
		},
	};
}
