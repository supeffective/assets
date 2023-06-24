export interface CmdOpts {
  css: boolean
  webp: boolean
  cssprefix: string
  shadowbg: boolean
  ext: string
  sorting: string | undefined
  prepend: string[]
  append: string[]
  width: string
  height: string
  padding: string
  crispy: boolean
  responsive: boolean
}

export interface CmdParams extends CmdOpts {
  md5: string
  srcDir: string
  outDir: string
  tmpDir: string
}

export interface SpriteIndexItem {
  path: string
  tmpPath?: string | undefined
  classNames: string[]
}
