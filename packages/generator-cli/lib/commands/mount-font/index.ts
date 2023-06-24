import path from 'node:path'
import { Command } from 'commander'
import svgtofont from 'svgtofont'

interface CmdArgs {
  fontName: string
  srcDir: string
  outDir: string
}

interface CmdOpts {
  prefix: string
}

type CmdProps = CmdArgs & CmdOpts

const resolveParams = function (
  fontName: string,
  srcDir: string,
  outDir: string,
  options: CmdOpts
): CmdProps {
  return {
    fontName,
    srcDir: path.resolve(srcDir),
    outDir: path.resolve(outDir),
    ...options,
  }
}

export default function mountFont(program: Command): void {
  program
    .command('mount-font')
    .description('Mounts a web font from a folder of SVGs.')
    .argument('<fontName>', 'Font name')
    .argument('<srcDir>', 'Source directory where the individual SVGs are.')
    .argument('<outDir>', 'Output directory where to save the font files.')
    .option('--prefix <value>', 'CSS Class Name prefix.', 'icon')
    .action(
      async (fontName: string, srcDir: string, outDir: string, options: CmdOpts): Promise<void> => {
        const params = resolveParams(fontName, srcDir, outDir, options)

        svgtofont({
          src: params.srcDir,
          dist: params.outDir,
          fontName,
          outSVGPath: false,
          outSVGReact: false,
          css: {
            fontSize: 'inherit',
          }, // Create CSS files.
          classNamePrefix: params.prefix,
          website: {
            logo: params.srcDir + '/ball.svg',
            links: [],
          },
        }).then(() => {
          console.log(`[mount-font] DONE`)
        })
      }
    )
}
