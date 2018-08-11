/* eslint-disable */
const webpack = require('webpack');  
const path = require('path')  
const HtmlWebpackPlugin = require('html-webpack-plugin');  
const ExtractTextPlugin = require("extract-text-webpack-plugin");  
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pageConfig = require('./page.config.js');

let webpackConfig = {
  mode: 'none',
  // 配置入口  
  entry: {},
  // 配置出口  
  output: {
    path: path.join(__dirname, "./dist/"),  
    filename: 'static/js/[name].[hash:7].js',  
    publicPath: '/',  
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',//代表将该loader的执行顺序放在最前面
        include: [path.join(__dirname, "./src")],//只命中src里面的JavaScript代码，加快webpack的搜索速度
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      // html中的img标签
      {//html中如果使用img标签的src加载资源的话，因为没有被依赖，所以图片没有被打包。这个loader解决这个问题，图片会被打包，路径也会处理好。
        //文档 https://www.npmjs.com/package/html-withimg-loader
        test: /\.html$/,
        loader:'html-withimg-loader',
        include: [path.join(__dirname, "./src")],
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {//1.将代码中的es6语法转化为es5,为最新的api注入profill(兼容性脚本),使之能支持低端浏览器
        //3.babel运行时，会根据.babelrc读取配置文件
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, "./src")]
      },
      {//如果图片小于（options.limit）10000,将图片转化为base64格式
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      },
      {//extractTextPlugin插件用来将本来要注入js中的css代码提取出来，放入单独的css文件
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },      
      {//用来处理less文件，use数组中loader的执行顺序是从右向左的
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      },
      {//用来处理less文件，use数组中loader的执行顺序是从右向左的
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
    ]
  },
  plugins:[
    new ExtractTextPlugin({
     filename: 'static/css/[name].[hash:7].css'
    }),
    //设置每一次build之前先删除dist  
    new CleanWebpackPlugin(  
      ['dist/*',],　     //匹配删除的文件  
      {  
          root: __dirname,   //根目录  
          verbose: true,    //开启在控制台输出信息  
          dry: false     //启用删除文件  
      }  
    )
  ],
  // 起本地服务
  devServer: {  
    contentBase: "./dist/",  
    historyApiFallback: true,  
    inline: true,  
    hot: false,  
    host: '127.0.0.1',
  }  
};

if (pageConfig && Array.isArray(pageConfig)) {//将pageConfig中的配置依次写入
  pageConfig.map(page => {
    webpackConfig.entry[page.name] = `./src/pages/${page.jsEntry}`;
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
      filename: path.join(__dirname,`/dist/${page.name}.html`),
      template: path.join(__dirname,`/src/pages/${page.html}`),
      inject: true,
      chunks: [page.name],  
      inlineSource: '.(js|css)$',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunksSortMode: 'dependency'
    }))
  })
}


module.exports = webpackConfig;