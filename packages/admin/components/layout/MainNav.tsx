'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon, XIcon } from 'lucide-react'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { Header } from '@/components/layout/Header'
import { Routes } from '@/lib/Routes'

export function MainNav(): JSX.Element {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const links = [
    // { href: Routes.Home, label: '/' },
    { href: Routes.Pokemon, label: 'Pokemon' },
    { href: Routes.Games, label: 'Games' },
    { href: Routes.Pokedexes, label: 'Pokedexes' },
    { href: Routes.Sprites, label: 'Sprites' },
    {
      label: 'Other',
      links: [
        { href: Routes.Abilities, label: 'Abilities' },
        { href: Routes.Moves, label: 'Moves' },
        { href: Routes.Items, label: 'Items' },
        { href: Routes.Ribbons, label: 'Ribbons' },
        { href: Routes.Marks, label: 'Marks' },
        { href: Routes.Locations, label: 'Locations' },
        { href: Routes.LegacyBoxPresets, label: 'Box Presets †' },
        { href: Routes.Families, label: 'Pokemon Families' },
      ],
    },
  ]

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  React.useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [menuOpen])

  React.useEffect(() => {
    function closeMenu() {
      setMenuOpen(false)
    }

    window.addEventListener('resize', closeMenu)

    return () => {
      window.removeEventListener('resize', closeMenu)
    }
  }, [])

  return (
    <Header
      className={cn('text-xs', [
        menuOpen,
        'relative',
        'backdrop-blur-none backdrop-filter-none z-10',
      ])}
    >
      <Link
        href={'/'}
        title="SuperEffective Assets Manager"
        className="p-3 border border-nxt-g1 rounded-md text-nxt-w1 bg-nxt-b2"
      >
        <Image
          src="/logo-white.png"
          width={32}
          height={32}
          alt="SuperEffective"
          className="mr-3 align-middle"
        />
        <span>Assets Manager</span>
      </Link>
      <div className="flex">
        <div
          className={cn(
            [!menuOpen, 'hidden xl:flex items-end'],
            [
              menuOpen,
              'flex flex-col xl:flex xl:flex-row',
              // 'shadow-nxt-b1/50 shadow-xl', // shadows
              // 'border-2 border-t-nxt-acc2 border-b-nxt-acc2', // border
              'bg-nxt-b2 xl:bg-transparent', // bg
              'fixed inset-0 z-20', // position
              'xl:relative xl:inset-auto xl:z-auto', // position
              'w-full h-full py-24 px-6 overflow-auto',
              'xl:w-auto xl:h-auto xl:py-0 xl:px-0 xl:overflow-auto',
              'text-right',
            ]
          )}
        >
          {links.map(({ href, label, links: subMenuLinks }, index) => {
            if (subMenuLinks) {
              return (
                <div
                  key={index}
                  className={cn('group cursor-default select-none p-4', [
                    href === pathname,
                    'underline',
                  ])}
                >
                  <span className="block pb-4 xl:pb-0 text-nxt-g3 uppercase xl:normal-case xl:text-inherit">
                    {label}
                  </span>
                  <div className="flex xl:hidden xl:group-hover:flex xl:absolute xl:top-full xl:right-0 xl:z-10 bg-nxt-b2 xl:border flex-col w-auto xl:w-56">
                    {subMenuLinks.map(({ href, label }, index) => (
                      <Link
                        key={index}
                        href={href}
                        className={cn('hover:underline py-4 px-0 xl:px-8', [
                          href === pathname,
                          'underline',
                        ])}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={index}
                href={href}
                className={cn('p-4 hover:underline', [href === pathname, 'underline'])}
              >
                {label}
              </Link>
            )
          })}
        </div>
        <div className="xl:hidden">
          <button className="flex z-30 place-items-center gap-2 p-4" onClick={toggleMenu}>
            {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
    </Header>
  )
}
