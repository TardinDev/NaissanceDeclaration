import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DeclarationFormData } from '@/types';

const STEPS = ['Enfant', 'Père', 'Mère', 'Déclarant'];

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

interface Props {
  initialData?: DeclarationFormData;
  onSubmit: (data: DeclarationFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function DeclarationForm({ initialData, onSubmit, isLoading }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<DeclarationFormData>(initialData || emptyForm);

  const updateField = (field: keyof DeclarationFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-4 h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'enfant</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childLastName">Nom *</Label>
                  <Input id="childLastName" value={form.childLastName} onChange={(e) => updateField('childLastName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childFirstNames">Prénom(s) *</Label>
                  <Input id="childFirstNames" value={form.childFirstNames} onChange={(e) => updateField('childFirstNames', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childBirthDate">Date de naissance *</Label>
                  <Input id="childBirthDate" type="date" value={form.childBirthDate} onChange={(e) => updateField('childBirthDate', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childBirthPlace">Lieu de naissance *</Label>
                  <Input id="childBirthPlace" value={form.childBirthPlace} onChange={(e) => updateField('childBirthPlace', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Sexe *</Label>
                  <Select value={form.childGender} onValueChange={(v) => { if (v) updateField('childGender', v); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculin">Masculin</SelectItem>
                      <SelectItem value="Féminin">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Informations du père</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherLastName">Nom</Label>
                  <Input id="fatherLastName" value={form.fatherLastName} onChange={(e) => updateField('fatherLastName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherFirstNames">Prénom(s)</Label>
                  <Input id="fatherFirstNames" value={form.fatherFirstNames} onChange={(e) => updateField('fatherFirstNames', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherBirthDate">Date de naissance</Label>
                  <Input id="fatherBirthDate" type="date" value={form.fatherBirthDate} onChange={(e) => updateField('fatherBirthDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherNationality">Nationalité</Label>
                  <Input id="fatherNationality" value={form.fatherNationality} onChange={(e) => updateField('fatherNationality', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherProfession">Profession</Label>
                  <Input id="fatherProfession" value={form.fatherProfession} onChange={(e) => updateField('fatherProfession', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fatherAddress">Adresse</Label>
                  <Input id="fatherAddress" value={form.fatherAddress} onChange={(e) => updateField('fatherAddress', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Informations de la mère</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motherLastName">Nom *</Label>
                  <Input id="motherLastName" value={form.motherLastName} onChange={(e) => updateField('motherLastName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherFirstNames">Prénom(s) *</Label>
                  <Input id="motherFirstNames" value={form.motherFirstNames} onChange={(e) => updateField('motherFirstNames', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherBirthDate">Date de naissance</Label>
                  <Input id="motherBirthDate" type="date" value={form.motherBirthDate} onChange={(e) => updateField('motherBirthDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherNationality">Nationalité</Label>
                  <Input id="motherNationality" value={form.motherNationality} onChange={(e) => updateField('motherNationality', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherProfession">Profession</Label>
                  <Input id="motherProfession" value={form.motherProfession} onChange={(e) => updateField('motherProfession', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="motherAddress">Adresse</Label>
                  <Input id="motherAddress" value={form.motherAddress} onChange={(e) => updateField('motherAddress', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Informations du déclarant</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="declarantLastName">Nom *</Label>
                  <Input id="declarantLastName" value={form.declarantLastName} onChange={(e) => updateField('declarantLastName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="declarantFirstNames">Prénom(s) *</Label>
                  <Input id="declarantFirstNames" value={form.declarantFirstNames} onChange={(e) => updateField('declarantFirstNames', e.target.value)} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Qualité du déclarant *</Label>
                  <Select value={form.declarantQuality} onValueChange={(v) => { if (v) updateField('declarantQuality', v); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Père">Père</SelectItem>
                      <SelectItem value="Mère">Mère</SelectItem>
                      <SelectItem value="Médecin">Médecin</SelectItem>
                      <SelectItem value="Sage-femme">Sage-femme</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={prev} disabled={step === 0}>
          Précédent
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next}>
            Suivant
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        )}
      </div>
    </form>
  );
}
