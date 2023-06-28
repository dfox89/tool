import fs from 'node:fs'
import inquirer from 'inquirer'
import configDefault from './config.mjs'
import startCompress from './compress.mjs'

// 输入根目录，若不存在则创建
if (!fs.existsSync(configDefault.inputRootPath)) fs.mkdirSync(configDefault.inputRootPath)

inquirer.prompt([
  {
    type: 'confirm',
    message: '清空输出目录？',
    name: 'isEmptyOutput',
    default: configDefault.isEmptyOutput
  },
  {
    type: 'input', // type用number的话，validate验证错误后，无法删除输入的值
    message: '压缩后最大宽度：',
    name: 'resizeMaxSize',
    default: configDefault.resizeMaxSize,
    validate: (value) => {
      if (!/^\d+$/.exec(value)) {
        return '值不正确'
      } else if (value <= 0 || value > 5000) {
        return '值需在[1, 5000]之间'
      } else {
        return true
      }
    }
  }
]).then((answers) => { // 压缩前置处理
  // 是否清空输出根目录
  if (answers.isEmptyOutput) {
    fs.rmSync(configDefault.outputRootPath, {
      force: true, // 目录不存在，则忽略错误
      recursive: true // 执行递归目录删除
    })
  }
  return Promise.resolve(answers)
}).then((answers) => { // 压缩
  return startCompress(
    configDefault.inputRootPath,
    configDefault.outputRootPath,
    {
      resizeMaxSize: parseFloat(answers.resizeMaxSize)
    }
  )
}).catch((error) => { // 失败
  console.log(error)
  if (error.isTtyError) {
    // Prompt couldn't be rendered in the current environment
  } else {
    // Something else went wrong
  }
})
