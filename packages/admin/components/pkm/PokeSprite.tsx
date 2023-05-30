export type PokeImgProps = { id: string; shiny?: boolean }

export function PokeSprite({ id, shiny }: PokeImgProps): JSX.Element {
  return (
    <i
      title={'.pkm-' + id}
      className={`w-full h-full aspect-square not-italic pkm pkm-${id}${shiny ? ' shiny' : ''}`}
    />
  )
}
