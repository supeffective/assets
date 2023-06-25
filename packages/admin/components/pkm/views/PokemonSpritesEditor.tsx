'use client'

import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { PokeImgFile } from '@/components/pkm/PokeImgFile'
import { PokeSprite } from '@/components/pkm/PokeSprite'
import { PrevNextPokemon } from '@/components/pkm/views/PrevNextPokemon'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Sprite } from '@/components/primitives/boxes/Sprite'

export function PokemonSpritesEditor({ pkm }: { pkm: Pokemon }) {
  return (
    <>
      <h4 className="text-xl font-bold mb-4">Box Sprites (CSS)</h4>
      <p>
        The following images are part of a large sprite sheet. They are rendered using CSS classes
        and are not actual image files. This is the preferred method of rendering sprites on the
        web.
        <br />
        <br />
      </p>
      <Flex className="text-center">
        <Flex vertical className="bg-nxt-b3 p-2 rounded-lg">
          <h4 className="text-sm text-nxt-w1 mb-4 bg-nxt-b4 p-2 rounded-lg">
            Gen8 Pixel-art Style
          </h4>
          <Flex className="justify-center content-center items-center flex-1">
            <Sprite size={136} className="border border-nxt-g3">
              <PokeSprite id={pkm.id} variant="gen8" />
            </Sprite>
            <Sprite size={136} className="border border-nxt-g3">
              <PokeSprite id={pkm.id} variant="gen8" shiny />
            </Sprite>
          </Flex>
        </Flex>
        <Flex vertical className="bg-nxt-b3 p-2 rounded-lg">
          <h4 className="text-sm text-nxt-w1 mb-4 bg-nxt-b4 p-2 rounded-lg">
            HOME 2D Vector Style
          </h4>
          <Flex className="justify-center content-center items-center flex-1">
            <Sprite size={136} className="border border-nxt-g3">
              <PokeSprite id={pkm.id} variant="home2d" />
            </Sprite>
            <Sprite size={136} className="border border-nxt-g3">
              <PokeSprite id={pkm.id} variant="home2d" shiny />
            </Sprite>
          </Flex>
        </Flex>
        <Flex vertical className="bg-nxt-b3 p-2 rounded-lg">
          <h4 className="text-sm text-nxt-w1 mb-4 bg-nxt-b4 p-2 rounded-lg">
            HOME 3D Render Style
          </h4>
          <Flex className="justify-center content-center items-center flex-1">
            <Sprite size={136} className="border border-nxt-g3">
              <PokeSprite id={pkm.id} />
            </Sprite>
            <Sprite size={136} className="border border-nxt-g3">
              <PokeSprite id={pkm.id} shiny />
            </Sprite>
          </Flex>
        </Flex>
      </Flex>
      <h4 className="text-xl font-bold mb-4">Box Sprite (Files)</h4>
      <p>
        The following images are the individual files that are later used to mount the sprite sheet.
        <br />
        You can replace these individual files by clicking on them or drag-and-dropping a new image.
        <br />
        <br />
      </p>
      <Flex className="text-center">
        <Flex vertical className="bg-nxt-b3 p-2 rounded-lg">
          <h4 className="text-sm text-nxt-w1 mb-4 bg-nxt-b4 p-2 rounded-lg">
            Gen8 Pixel-art Style
          </h4>
          <Flex className="justify-center content-center items-center flex-1">
            <PokeImgFile
              editable
              nid={pkm.nid}
              variant="gen8-icon"
              className="border border-nxt-g3"
            />
            <PokeImgFile
              editable
              nid={pkm.nid}
              shiny
              variant="gen8-icon"
              className="border border-nxt-g3"
            />
          </Flex>
        </Flex>
        <Flex vertical className="bg-nxt-b3 p-2 rounded-lg">
          <h4 className="text-sm text-nxt-w1 mb-4 bg-nxt-b4 p-2 rounded-lg">
            HOME 2D Vector Style
          </h4>
          <Flex className="justify-center content-center items-center flex-1">
            <PokeImgFile
              editable
              nid={pkm.nid}
              variant="home2d-icon"
              className="border border-nxt-g3"
            />
            <PokeImgFile
              editable
              nid={pkm.nid}
              shiny
              variant="home2d-icon"
              className="border border-nxt-g3"
            />
          </Flex>
        </Flex>
        <Flex vertical className="bg-nxt-b3 p-2 rounded-lg">
          <h4 className="text-sm mb-4 text-nxt-w1 bg-nxt-b4 p-2 rounded-lg">
            HOME 3D Render Style
          </h4>
          <Flex className="justify-center content-center items-center flex-1">
            <PokeImgFile
              editable
              nid={pkm.nid}
              variant="home3d-icon"
              className="border border-nxt-g3"
            />
            <PokeImgFile
              editable
              nid={pkm.nid}
              shiny
              variant="home3d-icon"
              className="border border-nxt-g3"
            />
          </Flex>
        </Flex>
      </Flex>
      <PrevNextPokemon id={pkm.id} />
    </>
  )
}
