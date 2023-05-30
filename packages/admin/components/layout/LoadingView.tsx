import { Hero } from '@/components/layout/Hero'
import { Layout } from '@/components/layout/Layout'
import { MainFooter } from '@/components/layout/MainFooter'
import { MainNav } from '@/components/layout/MainNav'

export function LoadingView(): JSX.Element {
  return (
    <Layout>
      <MainNav />
      <Hero>
        <div role="status" className="flex h-full w-full flex-col items-center justify-center">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-t-2 border-l-2 border-gray-200"
          />
          <span className="sr-only">Loading...</span>
        </div>
      </Hero>
      <MainFooter />
    </Layout>
  )
}
