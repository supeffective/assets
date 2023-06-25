import fs from 'node:fs'
import path from 'node:path'

import { runCommandSync } from '@pkg/utils'

import { CmdParams, SpriteIndexItem } from '../types'

type GridCell = {
  classNames: string[]
  pos: {
    cellX: number
    cellY: number
    absX: number
    absY: number
    percentX: number
    percentY: number
  }
}

export const generateCss = function (index: SpriteIndexItem[], params: CmdParams): void {
  const imgFile = path.join(params.outDir, 'spritesheet.png')
  const cssFile = path.join(params.outDir, 'spritesheet.css')
  const htmlFile = path.join(params.outDir, 'preview.html')

  // if (pathExists(cssFile)) {
  //   console.log(`[generateCss] SKIPPING. CSS file already exists`)
  //   return
  // }

  const spriteSheetWidth = parseInt(runCommandSync(`identify -format '%w' "${imgFile}"`))
  const spriteSheetHeight = parseInt(runCommandSync(`identify -format '%h' "${imgFile}"`))

  const outerThumbWidth = parseInt(params.width) + parseInt(params.padding) * 2
  const outerThumbHeight = parseInt(params.height) + parseInt(params.padding) * 2

  const grid: Array<GridCell[]> = [[]]
  const gridSizeSqrt = Math.ceil(Math.sqrt(index.length))
  const maxGridCols = gridSizeSqrt
  const maxGridRows = gridSizeSqrt
  const aspectRatio = parseInt(params.width) / parseInt(params.height)
  let currentGridRow = 0

  // calculate dimensions for every spritesheet tile
  for (const item of index) {
    if (grid[currentGridRow] === undefined) {
      grid.push([])
    }

    if (grid[currentGridRow].length >= maxGridCols) {
      // jump to next row if current one is already full
      currentGridRow++
      grid.push([])
    }

    const cell: GridCell = {
      classNames: item.classNames,
      pos: {
        cellX: 0,
        cellY: 0,
        absX: 0,
        absY: 0,
        percentX: 0,
        percentY: 0,
      },
    }

    cell.pos.cellX = grid[currentGridRow].length
    cell.pos.cellY = grid.length - 1

    cell.pos.absX = cell.pos.cellX * outerThumbWidth
    cell.pos.absY = cell.pos.cellY * outerThumbHeight

    cell.pos.percentX = (cell.pos.absX / (spriteSheetWidth - outerThumbWidth)) * 100
    cell.pos.percentY = (cell.pos.absY / (spriteSheetHeight - outerThumbHeight)) * 100

    grid[currentGridRow].push(cell)
  }

  // generate CSS code

  const cssBgSizeX = maxGridCols * 100
  const cssBgSizeY = maxGridRows * 100
  const bgImageExt = params.webp ? 'webp' : 'png'
  const bgImage = params.shadowbg
    ? `url(spritesheet.${bgImageExt}), url(spritesheet-shadow.${bgImageExt})`
    : `url(spritesheet.${bgImageExt})`
  const bgSize = params.responsive ? `${cssBgSizeX}% ${cssBgSizeY}%` : `initial`

  let cssSource = `
.${params.cssprefix} {
    display: inline-block;
    width: ${params.width}px;
    max-width: 100%;
    height: auto;
    aspect-ratio: ${aspectRatio};
    background-repeat: no-repeat;
    background-image: ${bgImage};
    background-size: ${bgSize};
}

img.${params.cssprefix} {
  max-width: 100%;
}
  `

  if (params.crispy) {
    cssSource += `\n

.${params.cssprefix} {
    image-rendering: crisp-edges;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
}
  `
  }

  const htmlBegin = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>
    <link rel="stylesheet" href="spritesheet.css">
    <style>
    .grid {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(6, ${params.width}px);
    }
     .grid-cell {
        width: ${params.width}px;
        height: ${params.height}px;
     }
    </style>
</head>
<body>
  <div class="grid shiny-on-hover">
  `

  let htmlSource = ''

  const htmlEnd = `
  </div>
</body>
</html>
  `

  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex]
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = row[colIndex]
      const cssClasses = cell.classNames
        .map(slug => {
          return `.${params.cssprefix}-${slug}`
        })
        .join(', ')

      const bgPosX = cell.pos.percentX === 0 ? 0 : `${cell.pos.percentX}%`
      const bgPosY = cell.pos.percentY === 0 ? 0 : `${cell.pos.percentY}%`

      cssSource += `${cssClasses} {background-position: ${bgPosX} ${bgPosY};}\n`

      for (const slug of cell.classNames) {
        const className = `${params.cssprefix}-${slug}`
        htmlSource += `<span title="${className}" class="grid-cell ${params.cssprefix} ${className}"></span>\n`
      }
    }
  }

  fs.writeFileSync(cssFile, cssSource)
  fs.writeFileSync(htmlFile, htmlBegin + htmlSource + htmlEnd)

  // get spritesheet image dimensions
  //
  console.log(`[generateCss] DONE`)
}
