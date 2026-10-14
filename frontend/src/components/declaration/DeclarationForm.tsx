import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError, FormAlert } from '@/components/common/FormError';
import { formatDate, todayIso } from '@/lib/format';
import type { DeclarationFormData } from '@/types';

type FieldName = keyof DeclarationFormData;

interface FieldConfig {
  name: FieldName;
  label: string;
  type?: 'text' | 'date' | 'select';
  options?: string[];
  required?: boolean;
  wide?: boolean;
}

interface StepConfig {
  label: string;
  title: string;
  hint?: string;
  fields: FieldConfig[];
}

const FIELD_STEPS: StepConfig[] = [
  {
    label: 'Enfant',
    title: "L'enfant",
    fields: [
      { name: 'childLastName', label: 'Nom', required: true },
      { name: 'childFirstNames', label: 'Prénom(s)', required: true },
      { name: 'childBirthDate', label: 'Date de naissance', type: 'date', required: true },
      { name: 'childBirthPlace', label: 'Lieu de naissance', required: true },
      { name: 'childGender', label: 'Sexe', type: 'select', options: ['Masculin', 'Féminin'], required: true },
    ],
  },
  {
    label: 'Père',
    title: 'Le père',
    hint: 'Ces informations sont facultatives.',
    fields: [
      { name: 'fatherLastName', label: 'Nom' },
      { name: 'fatherFirstNames', label: 'Prénom(s)' },
      { name: 'fatherBirthDate', label: 'Date de naissance', type: 'date' },
      { name: 'fatherNationality', label: 'Nationalité' },
      { name: 'fatherProfession', label: 'Profession' },
      { name: 'fatherAddress', label: 'Adresse', wide: true },
    ],
  },
  {
    label: 'Mère',
    title: 'La mère',
    fields: [
      { name: 'motherLastName', label: 'Nom', required: true },
      { name: 'motherFirstNames', label: 'Prénom(s)', required: true },
      { name: 'motherBirthDate', label: 'Date de naissance', type: 'date' },
      { name: 'motherNationality', label: 'Nationalité' },
      { name: 'motherProfession', label: 'Profession' },
      { name: 'motherAddress', label: 'Adresse', wide: true },
    ],
  },
  {
    label: 'Déclarant',
    title: 'Le déclarant',
    hint: 'La personne qui effectue cette déclaration.',
    fields: [
      {
        name: 'declarantQuality',
        label: 'Qualité du déclarant',
        type: 'select',
        options: ['Père', 'Mère', 'Médecin', 'Sage-femme', 'Autre'],
        required: true,
        wide: true,
      },
      { name: 'declarantLastName', label: 'Nom', required: true },
      { name: 'declarantFirstNames', label: 'Prénom(s)', required: true },
    ],
  },
];

const STEP_LABELS = [...FIELD_STEPS.map((s) => s.label), 'Vérification'];
const LAST_STEP = STEP_LABELS.length - 1;

const REQUIRED_DOCUMENTS = [
  { key: 'certificatAccouchement', label: "Certificat médical d'accouchement", description: 'Délivré par le médecin ou la sage-femme ayant assisté à la naissance.' },
  { key: 'pieceIdentiteDeclarant', label: "Pièce d'identité du déclarant", description: "Carte nationale d'identité ou passeport en cours de validité." },
  { key: 'pieceIdentiteMere', label: "Pièce d'identité de la mère", description: "Carte nationale d'identité ou passeport de la mère." },
  { key: 'livretFamille', label: 'Livret de famille', description: "S'il existe, pour mise à jour. Sinon, un livret sera établi." },
] as const;

const emptyForm: DeclarationFormData = {
  childLastName: '',
  childFirstNames: '',
  childBirthDate: '',
  childBirthPlace: '',
  childGender: '',
  fatherLastName: '',
  fatherFirstNames: '',
  fatherBirthDate: '',
  fatherNationality: '',
  fatherProfession: '',
  fatherAddress: '',
  motherLastName: '',
  motherFirstNames: '',
  motherBirthDate: '',
  motherNationality: '',
  motherProfession: '',
  motherAddress: '',
  declarantLastName: '',
  declarantFirstNames: '',
  declarantQuality: '',
};

type Errors = Partial<Record<FieldName, string>>;

function validateStep(stepIndex: number, form: DeclarationFormData): Errors {
  const errors: Errors = {};
  const today = todayIso();

  for (const field of FIELD_STEPS[stepIndex].fields) {
    const value = form[field.name].trim();
    if (field.required && !value) {
      errors[field.name] = 'Ce champ est obligatoire.';
    } else if (field.type === 'date' && value) {
      if (value > today) {
        errors[field.name] = 'La date ne peut pas être dans le futur.';
      } else if (field.name !== 'childBirthDate' && form.childBirthDate && value >= form.childBirthDate) {
        errors[field.name] = "La date doit être antérieure à la naissance de l'enfant.";
      }
    }
  }
  return errors;
}

function trimForm(form: DeclarationFormData): DeclarationFormData {
  const trimmed = { ...form };
  for (const key of Object.keys(trimmed) as FieldName[]) {
    trimmed[key] = trimmed[key].trim();
  }
  return trimmed;
}

interface Props {
  initialData?: DeclarationFormData;
  onSubmit: (data: DeclarationFormData) => Promise<void>;
  onSaveDraft: (data: DeclarationFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function DeclarationForm({ initialData, onSubmit, onSaveDraft, isLoading, error }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<DeclarationFormData>(initialData || emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [documents, setDocuments] = useState<Record<string, boolean>>({});
  const [documentsError, setDocumentsError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const goToStep = (index: number) => {
    setStep(index);
    formRef.current?.scrollIntoView({ block: 'start' });
  };

  const allDocumentsChecked = REQUIRED_DOCUMENTS.every((doc) => documents[doc.key]);

  const updateField = (field: FieldName, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Le père ou la mère déclare : on reprend son identité déjà saisie
      if (field === 'declarantQuality') {
        if (value === 'Père' && prev.fatherLastName && prev.fatherFirstNames) {
          next.declarantLastName = prev.fatherLastName;
          next.declarantFirstNames = prev.fatherFirstNames;
        } else if (value === 'Mère' && prev.motherLastName && prev.motherFirstNames) {
          next.declarantLastName = prev.motherLastName;
          next.declarantFirstNames = prev.motherFirstNames;
        }
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const focusField = (name: FieldName) => {
    requestAnimationFrame(() => document.getElementById(name)?.focus());
  };

  const next = () => {
    const stepErrors = validateStep(step, form);
    setErrors(stepErrors);
    const firstInvalid = Object.keys(stepErrors)[0] as FieldName | undefined;
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }
    goToStep(Math.min(step + 1, LAST_STEP));
  };

  const prev = () => {
    setErrors({});
    goToStep(Math.max(step - 1, 0));
  };

  /** Valide toutes les étapes et revient à la première qui contient une erreur. */
  const validateAll = (): boolean => {
    for (let i = 0; i < FIELD_STEPS.length; i++) {
      const stepErrors = validateStep(i, form);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        goToStep(i);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < LAST_STEP) {
      next();
      return;
    }
    if (!validateAll()) return;
    if (!allDocumentsChecked) {
      setDocumentsError(true);
      return;
    }
    await onSubmit(trimForm(form));
  };

  const handleSaveDraft = async () => {
    if (!validateAll()) return;
    await onSaveDraft(trimForm(form));
  };

  const currentStep = FIELD_STEPS[step];

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="scroll-mt-20">
      {/* Progress */}
      <div className="mb-10">
        <p className="text-[15px] text-muted-foreground">
          Étape {step + 1} sur {STEP_LABELS.length}
        </p>
        <ol className="mt-3 flex gap-1.5">
          {STEP_LABELS.map((label, i) => (
            <li key={label} className="flex-1" aria-current={i === step ? 'step' : undefined}>
              <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  goToStep(i);
                }}
                disabled={i >= step}
                className={`mt-2 hidden text-[13px] md:block ${
                  i === step
                    ? 'font-medium text-foreground'
                    : i < step
                      ? 'cursor-pointer text-primary hover:underline'
                      : 'text-muted-foreground'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep ? (
            <fieldset>
              <legend className="text-[28px] font-semibold tracking-[-0.015em] md:text-[32px]">
                {currentStep.title}
              </legend>
              <p className="mt-2 text-[17px] text-muted-foreground">
                {currentStep.hint ?? 'Les champs marqués d’un astérisque sont obligatoires.'}
              </p>
              <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
                {currentStep.fields.map((field) => {
                  const fieldError = errors[field.name];
                  const describedBy = fieldError ? `${field.name}-error` : undefined;
                  return (
                    <div key={field.name} className={`space-y-2 ${field.wide ? 'md:col-span-2' : ''}`}>
                      <Label htmlFor={field.name}>
                        <span>
                          {field.label}
                          {field.required && <span aria-hidden="true"> *</span>}
                        </span>
                      </Label>
                      {field.type === 'select' ? (
                        <Select
                          value={form[field.name]}
                          onValueChange={(v) => {
                            if (v) updateField(field.name, v);
                          }}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-required={field.required}
                            aria-invalid={fieldError ? true : undefined}
                            aria-describedby={describedBy}
                          >
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type ?? 'text'}
                          max={field.type === 'date' ? todayIso() : undefined}
                          value={form[field.name]}
                          onChange={(e) => updateField(field.name, e.target.value)}
                          required={field.required}
                          aria-invalid={fieldError ? true : undefined}
                          aria-describedby={describedBy}
                        />
                      )}
                      <FieldError id={`${field.name}-error`} message={fieldError} />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ) : (
            <div>
              <h2 className="text-[28px] font-semibold md:text-[32px]">Vérifiez et envoyez.</h2>
              <p className="mt-2 text-[17px] text-muted-foreground">
                Relisez l'essentiel, puis confirmez que vous disposez des justificatifs.
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 rounded-card bg-muted p-7 md:grid-cols-2">
                {(
                  [
                    ['Enfant', `${form.childFirstNames} ${form.childLastName}`],
                    ['Naissance', `${formatDate(form.childBirthDate)}, ${form.childBirthPlace}`],
                    ['Mère', `${form.motherFirstNames} ${form.motherLastName}`],
                    ['Père', `${form.fatherFirstNames} ${form.fatherLastName}`.trim() || 'Non renseigné'],
                    ['Déclarant', `${form.declarantFirstNames} ${form.declarantLastName} (${form.declarantQuality})`],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[13px] text-muted-foreground">{label}</dt>
                    <dd className="text-[17px]">{value}</dd>
                  </div>
                ))}
              </dl>

              <fieldset className="mt-10">
                <legend className="text-[21px] font-semibold">Justificatifs</legend>
                <div className="mt-4 space-y-3">
                  {REQUIRED_DOCUMENTS.map((doc) => (
                    <label
                      key={doc.key}
                      className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                        documents[doc.key] ? 'border-primary bg-primary/5' : 'border-[#d2d2d7] hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(documents[doc.key])}
                        onChange={() => {
                          setDocuments((p) => ({ ...p, [doc.key]: !p[doc.key] }));
                          setDocumentsError(false);
                        }}
                        className="mt-1 size-4 shrink-0 accent-primary"
                      />
                      <span>
                        <span className="block text-[17px] font-medium">{doc.label}</span>
                        <span className="block text-[15px] text-muted-foreground">{doc.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {documentsError && !allDocumentsChecked && (
                  <p role="alert" className="mt-3 text-[15px] text-destructive">
                    Cochez les quatre justificatifs pour soumettre la déclaration. Vous pouvez aussi l'enregistrer
                    en brouillon et y revenir plus tard.
                  </p>
                )}
              </fieldset>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="mt-8">
          <FormAlert message={error} />
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
        <Button type="button" variant="secondary" size="lg" onClick={prev} disabled={step === 0 || isLoading}>
          Précédent
        </Button>
        {step < LAST_STEP ? (
          <Button type="submit" size="lg">
            Continuer
          </Button>
        ) : (
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <Button type="button" variant="outline" size="lg" onClick={handleSaveDraft} disabled={isLoading}>
              Enregistrer le brouillon
            </Button>
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? 'Envoi…' : 'Soumettre la déclaration'}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
