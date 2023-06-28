import url from 'node:url'
import path from 'node:path'

// 获取__filename的ESM写法
const __filename = url.fileURLToPath(import.meta.url)
// 获取__dirname的ESM写法
const __dirname = path.dirname(__filename)

export default {
  // 图片输入根目录
  inputRootPath: path.join(__dirname, 'input'),
  // 图片输出根目录
  outputRootPath: path.join(__dirname, 'output'),
  // 是否清空输出根目录
  isEmptyOutput: true,
  // 压缩后图片宽/高限制大小
  resizeMaxSize: 1920
}
