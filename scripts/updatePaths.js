const fs = require('fs')
const path = require('path')

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList)
    } else if (file.endsWith('.ux') || file.endsWith('.js')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// 更新文件中的路径
function updatePaths() {
  const pkgMainDir = path.join(__dirname, '../src/pkg_main')
  const files = getAllFiles(pkgMainDir)

  let totalReplacements = 0

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8')
    let modified = false

    // 替换图片路径
    const imgReplacements = [
      // /assets/img/ -> /pkg_main/assets/img/
      [/(['"])\/assets\/img\//g, '$1/pkg_main/assets/img/'],
      // ../../assets/img/ -> /pkg_main/assets/img/
      [
        /(['"])\.\.[\/\\]\.\.[\/\\]assets[\/\\]img[\/\\]/g,
        '$1/pkg_main/assets/img/'
      ],
      // /assets/shouru_icon/ -> /pkg_main/assets/shouru_icon/
      [/(['"])\/assets\/shouru_icon\//g, '$1/pkg_main/assets/shouru_icon/'],
      // /assets/zhihcu_icon/ -> /pkg_main/assets/zhihcu_icon/
      [/(['"])\/assets\/zhihcu_icon\//g, '$1/pkg_main/assets/zhihcu_icon/'],
      // ../../assets/zhihcu_icon/ -> /pkg_main/assets/zhihcu_icon/
      [
        /(['"])\.\.[\/\\]\.\.[\/\\]assets[\/\\]zhihcu_icon[\/\\]/g,
        '$1/pkg_main/assets/zhihcu_icon/'
      ]
    ]

    imgReplacements.forEach(([pattern, replacement]) => {
      const newContent = content.replace(pattern, replacement)
      if (newContent !== content) {
        content = newContent
        modified = true
        totalReplacements++
      }
    })

    // 替换 helper 路径
    const helperReplacements = [
      // from '../../helper/ -> from '/pkg_main/helper/
      [
        /from\s+(['"])\.\.[\/\\]\.\.[\/\\]helper[\/\\]/g,
        'from $1/pkg_main/helper/'
      ],
      // from './../../helper/ -> from '/pkg_main/helper/
      [
        /from\s+(['"])\.[\/\\]\.\.[\/\\]\.\.[\/\\]helper[\/\\]/g,
        'from $1/pkg_main/helper/'
      ],
      // from './../../../helper/ -> from '/pkg_main/helper/
      [
        /from\s+(['"])\.[\/\\]\.\.[\/\\]\.\.[\/\\]\.\.[\/\\]helper[\/\\]/g,
        'from $1/pkg_main/helper/'
      ]
    ]

    helperReplacements.forEach(([pattern, replacement]) => {
      const newContent = content.replace(pattern, replacement)
      if (newContent !== content) {
        content = newContent
        modified = true
        totalReplacements++
      }
    })

    // 替换 common 路径
    const commonReplacements = [
      // from '../../common/ -> from '/pkg_main/common/
      [
        /from\s+(['"])\.\.[\/\\]\.\.[\/\\]common[\/\\]/g,
        'from $1/pkg_main/common/'
      ],
      // from './../../common/ -> from '/pkg_main/common/
      [
        /from\s+(['"])\.[\/\\]\.\.[\/\\]\.\.[\/\\]common[\/\\]/g,
        'from $1/pkg_main/common/'
      ]
    ]

    commonReplacements.forEach(([pattern, replacement]) => {
      const newContent = content.replace(pattern, replacement)
      if (newContent !== content) {
        content = newContent
        modified = true
        totalReplacements++
      }
    })

    if (modified) {
      fs.writeFileSync(file, content, 'utf8')
      console.log(`已更新: ${path.relative(pkgMainDir, file)}`)
    }
  })

  console.log(`\n总共处理 ${files.length} 个文件`)
  console.log(`总共替换 ${totalReplacements} 处路径`)
}

updatePaths()
