import { Helmet } from 'react-helmet-async'
import { Header } from './Header'
import { Footer } from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Helmet>
        <title>SkyTeam Training — Virtual Aviation Alliance</title>
        <meta name="description" content="Professional virtual aviation training and certification for PTFS SkyTeam Alliance." />
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
