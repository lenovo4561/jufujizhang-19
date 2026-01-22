const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// 需要压缩的大图片列表（超过 50KB 的）
const largeImages = [
  'src/pkg_main/assets/img/icon.png',
  'src/pkg_main/assets/img/loading-bg.png',
  'src/pkg_main/assets/img/loading-icon.png',
  'src/pkg_main/assets/img/shangdian-bg.png',
  'src/pkg_main/assets/img/shouyedingbg-1.png',
  'src/pkg_main/assets/img/shouyedingbg.png'
]

async function compressImage(relativePath) {
  try {
    const filePath = path.join(__dirname, '..', relativePath)

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${relativePath}`)
      return
    }

    const originalStats = fs.statSync(filePath)
    const originalSize = originalStats.size

    // 获取图片信息
    const metadata = await sharp(filePath).metadata()

    // 压缩策略：保持原始尺寸，但提高压缩率
    await sharp(filePath)
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true
      })
      .toFile(filePath + '.tmp')

    // 检查压缩后的大小
    const compressedStats = fs.statSync(filePath + '.tmp')
    const compressedSize = compressedStats.size

    // 如果压缩后变小了，则替换原文件
    if (compressedSize < originalSize) {
      fs.unlinkSync(filePath)
      fs.renameSync(filePath + '.tmp', filePath)

      const saved = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(2)
      console.log(`✅ ${relativePath}`)
      console.log(
        `   原始: ${(originalSize / 1024).toFixed(2)}KB -> 压缩后: ${(
          compressedSize / 1024
        ).toFixed(2)}KB (节省 ${saved}%)`
      )
    } else {
      fs.unlinkSync(filePath + '.tmp')
      console.log(`⚠️  ${relativePath} - 压缩后反而更大，保持原样`)
    }
  } catch (error) {
    console.error(`❌ 压缩失败: ${relativePath}`, error.message)
  }
}

async function compressAllImages() {
  console.log('开始压缩大图片...\n')

  for (const imagePath of largeImages) {
    await compressImage(imagePath)
  }

  console.log('\n✅ 所有图片压缩完成！')
}

compressAllImages()
