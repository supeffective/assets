'use client'

import { useState } from 'react'
import { Gamepad2Icon, ImageIcon, LanguagesIcon, Link2Icon } from 'lucide-react'

import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { PokemonFormsEditor } from '@/components/pkm/views/PokemonFormsEditor'
import { PokemonGameSetEditor } from '@/components/pkm/views/PokemonGameSetEditor'
import { PokemonRefsEditor } from '@/components/pkm/views/PokemonRefsEditor'
import { PokemonSpritesEditor } from '@/components/pkm/views/PokemonSpritesEditor'
import { PokemonStatsEditor } from '@/components/pkm/views/PokemonStatsEditor'
import { Box } from '@/components/primitives/boxes/Box'
import { Tab, Tabs } from '@/components/primitives/boxes/Tabs'
import { Button } from '@/components/primitives/controls/Button'

export type PokemonEditFormProps = {
  pokemon: Pokemon
}

export function PokemonEditForm({ pokemon }: PokemonEditFormProps) {
  const [pkm, setPkm] = useState<Pokemon>(pokemon)

  return (
    <div className="w-full max-w-5xl mx-auto">
      <input type="hidden" name="id" value={pkm.id} />
      <Tabs id="tabs">
        <Tab label="General">
          <Box.Content>
            <PokemonStatsEditor pkm={pkm} />
          </Box.Content>
          <Box.Footer>
            <span />
            <Button type="submit">Save</Button>
          </Box.Footer>
        </Tab>
        <Tab label="Forms">
          <Box.Content>
            <PokemonFormsEditor
              pkm={pkm}
              onChange={pkm => {
                setPkm({ ...pkm })
              }}
            />
          </Box.Content>
          <Box.Footer>
            <span />
            <Button type="submit">Save</Button>
          </Box.Footer>
        </Tab>
        <Tab
          title="Availability in Games"
          label={
            <>
              <Gamepad2Icon className="h-icon-3 mr-2 lg:mr-0" />
              <span className="lg:hidden">In Games</span>
            </>
          }
        >
          <Box.Content>
            <PokemonGameSetEditor pkm={pkm} />
          </Box.Content>
          <Box.Footer>
            <span />
            <Button type="submit">Save</Button>
          </Box.Footer>
        </Tab>
        <Tab
          title="Sprites"
          label={
            <>
              <ImageIcon className="h-icon-3 mr-2 lg:mr-0" />
              <span className="lg:hidden">Sprites</span>
            </>
          }
        >
          <Box.Content>
            <PokemonSpritesEditor pkm={pkm} />
          </Box.Content>
          <Box.Footer>
            <span />
            <Button type="submit">Save</Button>
          </Box.Footer>
        </Tab>
        <Tab
          title="Translations"
          label={
            <>
              <LanguagesIcon className="h-icon-3 mr-2 lg:mr-0" />
              <span className="lg:hidden">Translations</span>
            </>
          }
        >
          <Box.Content>
            <h4 className="text-xl font-bold mb-4">Translations</h4>
          </Box.Content>
          <Box.Footer>
            <span />
            <Button type="submit">Save</Button>
          </Box.Footer>
        </Tab>
        <Tab
          title="External References"
          label={
            <>
              <Link2Icon className="h-icon-3 mr-2 lg:mr-0" />
              <span className="lg:hidden">References</span>
            </>
          }
        >
          <Box.Content>
            <PokemonRefsEditor pkm={pkm} />
          </Box.Content>
          <Box.Footer>
            <span />
            <Button type="submit">Save</Button>
          </Box.Footer>
        </Tab>
      </Tabs>
    </div>
  )
}
