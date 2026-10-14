import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError, FormAlert } from '@/components/common/FormError';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuthStore } from '@/store/useAuthStore';

interface Props {
  onSuccess: () => void;
}

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'consent';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm({ onSuccess }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  // Champ leurre : invisible pour un humain, rempli par les robots
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const { register, isLoading, error, clearError } = useAuthStore();

  const validate = (): Partial<Record<Field, string>> => {
    const next: Partial<Record<Field, string>> = {};
    if (!firstName.trim()) next.firstName = 'Indiquez votre prénom.';
    if (!lastName.trim()) next.lastName = 'Indiquez votre nom.';
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Saisissez une adresse e-mail valide.';
    if (password.length < 8) next.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    if (confirmPassword !== password) next.confirmPassword = 'Les mots de passe ne correspondent pas.';
    if (!consent) next.consent = "Vous devez accepter les conditions d'utilisation pour créer un compte.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (website) return;

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), password);
      onSuccess();
    } catch {
      // Error handled by store
    }
  };

  const fieldProps = (field: Field) => ({
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="text-center">
        <h1 className="text-[40px] font-semibold">Créez votre compte.</h1>
        <p className="mt-3 text-[19px] text-muted-foreground">Un seul compte pour toutes vos déclarations.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
        <FormAlert message={error} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              {...fieldProps('firstName')}
            />
            <FieldError id="firstName-error" message={errors.firstName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              {...fieldProps('lastName')}
            />
            <FieldError id="lastName-error" message={errors.lastName} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            {...fieldProps('email')}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            {...fieldProps('password')}
          />
          {errors.password ? (
            <FieldError id="password-error" message={errors.password} />
          ) : (
            <p className="text-[13px] text-muted-foreground">8 caractères au minimum.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            {...fieldProps('confirmPassword')}
          />
          <FieldError id="confirmPassword-error" message={errors.confirmPassword} />
        </div>

        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Ne remplissez pas ce champ</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="flex cursor-pointer items-start gap-3 text-[15px] text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-primary"
              {...fieldProps('consent')}
            />
            <span>
              J'accepte les{' '}
              <Link to="/cgu" className="text-primary hover:underline">
                conditions d'utilisation
              </Link>{' '}
              et j'ai lu la{' '}
              <Link to="/confidentialite" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <FieldError id="consent-error" message={errors.consent} />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Création du compte…' : 'Créer mon compte'}
        </Button>
        <p className="text-center text-[15px] text-muted-foreground">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter <span aria-hidden="true">›</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
