const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// 源文件和目标文件路径
const sourcePath = path.join(__dirname, '../src/assets/images/logo.png')
const targetPath = path.join(__dirname, '../src/assets/images/logo.png')

async function compressLogo() {
  try {
    console.log('开始压缩 logo...')
    console.log('源文件:', sourcePath)

    // 检查文件是否存在
    if (!fs.existsSync(sourcePath)) {
      console.error('源文件不存在:', sourcePath)
      return
    }

    // 压缩并调整大小到 192x192
    await sharp(sourcePath)
      .resize(192, 192, {
        fit: 'cover',
        position: 'center'
      })
      .png({
        quality: 80,
        compressionLevel: 9
      })
      .toFile(targetPath + '.tmp')

    // 替换原文件
    fs.renameSync(targetPath + '.tmp', targetPath)

    console.log('Logo 压缩完成！已调整为 192x192 分辨率')

    // 显示文件大小
    const stats = fs.statSync(targetPath)
    console.log(`文件大小: ${(stats.size / 1024).toFixed(2)} KB`)
  } catch (error) {
    console.error('压缩失败:', error)
    process.exit(1)
  }
}

compressLogo()
