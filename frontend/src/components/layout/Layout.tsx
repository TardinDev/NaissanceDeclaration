import { Outlet, ScrollRestoration } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
    </MotionConfig>
  );
}
