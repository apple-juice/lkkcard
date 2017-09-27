var express = require('express')
var path = require('path')
var webpack = require('webpack')
var compress = require('compression')
var webpackConfig = require('../webpack.config')

const app = express()
const compiler = webpack(webpackConfig(process.env.NODE_ENV))

app.use(
  compress()
)

app.use(
  require('webpack-dev-middleware')(compiler, {
    publicPath: 'http://localhost:3000/assets/',
    contentBase: path.resolve(__dirname, '../src'),
    hot: true,
    lazy: false
  })
)

app.use(
  require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  })
)

app.use(
  express.static(path.resolve(__dirname, '../public'))
)

app.use('*', function (req, res, next) {
  const filename = path.join(compiler.outputPath, 'index.html')

  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err)
    }

    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

app.listen(3000)
