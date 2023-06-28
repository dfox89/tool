import path from 'node:path'
import fs from 'node:fs'
import Jimp from 'jimp'
import chalk from 'chalk'

export default startCompress

/**
 * 开始压缩
 * @param {string} inDir 输入目录
 * @param {string} outDir 输出目录
 * @param {object} options 其他配置
 */
async function startCompress (inDir, outDir, options) {
  console.log(chalk.yellow('开始'))

  // 输出根目录，若不存在则创建
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  // 执行压缩
  return compress(inDir, outDir, options).then(() => {
    console.log(chalk.yellow('完成'))
    return Promise.resolve()
  })
}

/**
 * 遍历压缩
 * @param {string} inDir 输入目录
 * @param {string} outDir 输出目录
 * @param {object} options 其他配置
 */
async function compress (inDir, outDir, options) {
  // 获取目录下所有文件，文件夹
  const all = fs.readdirSync(inDir)
  // 遍历
  for (let i = 0; i < all.length; i++) {
    const value = all[i]
    // 文件地址
    const valuePath = path.join(inDir, value)
    // 获取文件信息
    const stat = fs.statSync(valuePath)
    if (stat.isFile()) { // 是文件
      // 压缩图片
      await compressImage(valuePath, outDir, options)
    } else if (stat.isDirectory()) { // 是目录
      // 压缩子目录
      await compress(valuePath, path.join(outDir, value), options)
    }
  }
}

/**
 * 压缩图片
 * @param {string} filePath 文件地址
 * @param {string} savedDir 保存目录
 * @param {object} options 其他配置
 */
async function compressImage (filePath, savedDir, options) {
  // 获取文件名
  const fileName = path.basename(filePath)
  // 文件保存路径
  const savedPath = path.join(savedDir, fileName)
  // 压缩实例
  const jimpInstance = await Jimp.read(filePath)
  // 压缩
  await jimpInstance.resize(options.resizeMaxSize, Jimp.AUTO).writeAsync(savedPath)
  console.log(chalk.green(`成功 ${filePath}`))
}
