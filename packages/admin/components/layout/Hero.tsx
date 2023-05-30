export function Hero({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="relative z-10 flex flex-col place-items-center text-lg">{children}</div>
}
