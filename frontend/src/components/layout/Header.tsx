import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const { isAuthenticated, fullName, role, isCitizen, isAgent, isAdmin } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`;

  const roleLabel = role === 'ADMIN' ? 'Administrateur' : role === 'AGENT' ? 'Agent' : 'Citoyen';

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Mairie</span>
          <span className="text-muted-foreground">| Naissance</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" render={<Link to="/login" />}>
                Connexion
              </Button>
              <Button render={<Link to="/register" />}>
                Inscription
              </Button>
            </>
          ) : (
            <>
              {isCitizen && (
                <>
                  <Link to="/citizen/dashboard" className={navLinkClass('/citizen/dashboard')}>
                    Tableau de bord
                  </Link>
                  <Link to="/citizen/new-declaration" className={navLinkClass('/citizen/new-declaration')}>
                    Nouvelle Déclaration
                  </Link>
                </>
              )}
              {isAgent && (
                <Link to="/agent/dashboard" className={navLinkClass('/agent')}>
                  Tableau de bord
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className={navLinkClass('/admin')}>
                    Administration
                  </Link>
                  <Link to="/agent/dashboard" className={navLinkClass('/agent')}>
                    Traiter les déclarations
                  </Link>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground">{roleLabel}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
                Connexion
              </Link>
              <Link to="/register" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
                Inscription
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 pb-3 border-b mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{fullName}</p>
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                </div>
              </div>

              {isCitizen && (
                <>
                  <Link to="/citizen/dashboard" className={`block ${navLinkClass('/citizen/dashboard')}`} onClick={() => setMobileOpen(false)}>
                    Tableau de bord
                  </Link>
                  <Link to="/citizen/new-declaration" className={`block ${navLinkClass('/citizen/new-declaration')}`} onClick={() => setMobileOpen(false)}>
                    Nouvelle Déclaration
                  </Link>
                </>
              )}
              {isAgent && (
                <Link to="/agent/dashboard" className={`block ${navLinkClass('/agent')}`} onClick={() => setMobileOpen(false)}>
                  Tableau de bord
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className={`block ${navLinkClass('/admin')}`} onClick={() => setMobileOpen(false)}>
                    Administration
                  </Link>
                  <Link to="/agent/dashboard" className={`block ${navLinkClass('/agent')}`} onClick={() => setMobileOpen(false)}>
                    Traiter les déclarations
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="block text-sm font-medium text-destructive mt-3 pt-3 border-t w-full text-left"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
