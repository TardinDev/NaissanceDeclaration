import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormAlert } from '@/components/common/FormError';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuthStore } from '@/store/useAuthStore';

interface Props {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email.trim(), password);
      onSuccess();
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="text-center">
        <h1 className="text-[40px] font-semibold">Connexion.</h1>
        <p className="mt-3 text-[19px] text-muted-foreground">Accédez à votre espace état civil.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <FormAlert message={error} />
        <div className="space-y-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Connexion…' : 'Se connecter'}
        </Button>
        <p className="text-center text-[15px] text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Créer un compte <span aria-hidden="true">›</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
