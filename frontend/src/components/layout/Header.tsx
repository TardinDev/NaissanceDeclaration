import { Link, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Mairie</span>
          <span className="text-muted-foreground">| Naissance</span>
        </Link>

        <nav className="flex items-center gap-4">
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
                  <Button variant="ghost" render={<Link to="/citizen/dashboard" />}>
                    Tableau de bord
                  </Button>
                  <Button variant="ghost" render={<Link to="/citizen/new-declaration" />}>
                    Nouvelle Déclaration
                  </Button>
                </>
              )}
              {isAgent && (
                <Button variant="ghost" render={<Link to="/agent/dashboard" />}>
                  Tableau de bord
                </Button>
              )}
              {isAdmin && (
                <Button variant="ghost" render={<Link to="/admin/dashboard" />}>
                  Administration
                </Button>
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
                      <p className="text-xs text-muted-foreground">{role}</p>
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
      </div>
    </header>
  );
}
