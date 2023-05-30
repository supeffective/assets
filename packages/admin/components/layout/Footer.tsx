export function Footer({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <footer className="mb-32 mt-16 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
      {children}
    </footer>
  )
}
