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
import type { Role } from '@/types';

const NAV_LINKS: Record<Role, { to: string; label: string }[]> = {
  CITIZEN: [
    { to: '/citizen/dashboard', label: 'Mes déclarations' },
    { to: '/citizen/new-declaration', label: 'Nouvelle déclaration' },
  ],
  AGENT: [{ to: '/agent/dashboard', label: 'À traiter' }],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Administration' },
    { to: '/agent/dashboard', label: 'À traiter' },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrateur',
  AGENT: 'Agent',
  CITIZEN: 'Citoyen',
};

export default function Header() {
  const { isAuthenticated, fullName, role, email } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/');
  };

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const links = role ? NAV_LINKS[role] : [];
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="wrap flex h-12 items-center justify-between">
        <Link to="/" className="text-[15px] font-semibold tracking-tight text-foreground">
          Mairie <span className="font-normal text-muted-foreground">État civil</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={isActive(link.to) ? 'page' : undefined}
              className={`text-[13px] transition-colors ${
                isActive(link.to) ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-[13px] text-foreground/70 transition-colors hover:text-foreground">
                Connexion
              </Link>
              <Button size="sm" render={<Link to="/register" />}>
                Créer un compte
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label={`Compte de ${fullName}`}
                    className="flex size-8 items-center justify-center rounded-full bg-ink text-xs font-medium text-white outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
                  />
                }
              >
                {initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">{fullName}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                  {role && <p className="mt-1 text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="-mr-2 flex size-11 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          aria-controls="menu-mobile"
        >
          <span className={`block h-px w-[18px] bg-foreground transition-transform ${mobileOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`block h-px w-[18px] bg-foreground transition-transform ${mobileOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-black/10 bg-white md:hidden">
          <div className="wrap flex flex-col py-4">
            {isAuthenticated && (
              <div className="mb-2 border-b pb-4">
                <p className="text-[17px] font-semibold">{fullName}</p>
                {role && <p className="text-sm text-muted-foreground">{ROLE_LABELS[role]}</p>}
              </div>
            )}
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? 'page' : undefined}
                onClick={closeMobile}
                className="py-3 text-[21px] font-semibold tracking-tight"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={closeMobile}
                className="py-3 text-[21px] font-semibold tracking-tight">
                  Connexion
                </Link>
                <Link to="/register" onClick={closeMobile}
                className="py-3 text-[21px] font-semibold tracking-tight">
                  Créer un compte
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 border-t pt-4 pb-1 text-left text-[17px] text-destructive"
              >
                Déconnexion
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
