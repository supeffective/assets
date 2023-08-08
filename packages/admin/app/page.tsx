import Image from 'next/image'

import { Hero } from '@/components/layout/Hero'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Button } from '@/components/primitives/controls/Button'

export default function Page() {
  return (
    <Hero>
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] aspect-square"
        src="/logo-white.png"
        alt="logo"
        width={120}
        height={40}
        priority
      />
      <br />
      <Flex>
        <Button href="/data/pokemon">View Pokémon</Button>
        <Button href="/data/pokemon/new" className="bg-amber-400">
          Add new Pokémon
        </Button>
      </Flex>
    </Hero>
  )
}
