module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: __dirname + "/public",
    // 将src/index.js打包成虚拟目录下的 index.js虚拟文件
    filename: './xuni/[name].js'
  },
  devServer: {
    contentBase: './public',
    inline: true
  }
}