export type PokeImgProps = { id: string; shiny?: boolean; variant?: 'gen8' | 'home2d' | 'home3d' }

export function PokeSprite({ id, shiny, variant }: PokeImgProps): JSX.Element {
  let variantClass = ''
  switch (variant) {
    case 'gen8':
      variantClass = 'pkm-g8'
      break
    case 'home2d':
      variantClass = 'pkm-2d'
      break
    default:
      variantClass = 'pkm'
      break
  }

  const pkmClass = `${variantClass}-${id}`

  return (
    <i
      title={pkmClass}
      className={`w-full h-full aspect-square not-italic ${variantClass} ${pkmClass}${
        shiny ? ' shiny' : ''
      }`}
    />
  )
}
