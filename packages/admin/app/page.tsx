import Image from 'next/image'

import { Hero } from '@/components/layout/Hero'

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
    </Hero>
  )
}
