var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var postCssConfig = require('./postcss.config')

const cwd = process.cwd()
const stylePaths = [
  path.join(cwd, 'src/styles')
]

const commonConfig = {
  resolve: {
    extensions: ['.js', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader', 'eslint-loader'],
        include: [
          path.join(__dirname, 'src')
        ]
      },
      {
        test: /\.woff?$/,
        loaders: ['url-loader?prefix=font/&limit=10000&mimetype=application/font-woff']
      },
      {
        test: /\.eot?$/,
        loaders: ['url-loader?prefix=font/&limit=10000&mimetype=application/font-eot']
      },
      {
        test: /\.ttf?$/,
        loaders: ['url-loader?prefix=font/&limit=10000&mimetype=application/font-ttf']
      },
      {
        test: /\.jpg$/,
        loaders: ['file-loader']
      },
      {
        test: /\.png$/,
        loaders: ['file-loader']
      },
      {
        test: /\.svg$/,
        loaders: ['file-loader']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.join('./src'),
        eslint: {
          fix: true,
          configFile: require.resolve('./.eslintrc')
        },
        postcss: postCssConfig
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/template.html'),
      hash: false,
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}

const developmentConfig = {
  entry: {
    index: [
      path.resolve('./src/index.js'),
      'webpack-hot-middleware/client?path=/__webpack_hmr'
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, '/'),
    publicPath: 'http://localhost:3000/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ],
        include: stylePaths
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
        include: stylePaths
      }
    ]
  }
}

const buildConfig = {
  entry: {
    index: path.resolve('./src/index.js')
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(__dirname, '/dist'),
    publicPath: ''
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.font.js$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: stylePaths
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader!sass-loader'
        }),
        include: stylePaths
      }
    ]
  }
}

module.exports = function (env) {
  switch (env) {
    case 'production':
      return merge(
        commonConfig,
        buildConfig
      )
    default:
      return merge(
        commonConfig,
        developmentConfig
      )
  }
}
