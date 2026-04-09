import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DeclarationStatusBadge from './DeclarationStatusBadge';
import DeclarationTimeline from './DeclarationTimeline';
import type { Declaration } from '@/types';

interface Props {
  declaration: Declaration;
}

export default function DeclarationDetail({ declaration }: Props) {
  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Déclaration {declaration.reference}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Créée le {formatDate(declaration.createdAt)}
            </p>
          </div>
          <DeclarationStatusBadge status={declaration.status} />
        </CardHeader>
        <CardContent>
          <DeclarationTimeline declaration={declaration} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de l'enfant</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Nom :</span>{' '}
            <span className="font-medium">{declaration.childLastName}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Prénom(s) :</span>{' '}
            <span className="font-medium">{declaration.childFirstNames}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Date de naissance :</span>{' '}
            <span className="font-medium">{formatDate(declaration.childBirthDate)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Lieu de naissance :</span>{' '}
            <span className="font-medium">{declaration.childBirthPlace}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sexe :</span>{' '}
            <span className="font-medium">{declaration.childGender}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations du père</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Nom :</span> {declaration.fatherLastName || '-'}</div>
            <div><span className="text-muted-foreground">Prénom(s) :</span> {declaration.fatherFirstNames || '-'}</div>
            <div><span className="text-muted-foreground">Date de naissance :</span> {formatDate(declaration.fatherBirthDate)}</div>
            <div><span className="text-muted-foreground">Nationalité :</span> {declaration.fatherNationality || '-'}</div>
            <div><span className="text-muted-foreground">Profession :</span> {declaration.fatherProfession || '-'}</div>
            <div><span className="text-muted-foreground">Adresse :</span> {declaration.fatherAddress || '-'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations de la mère</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Nom :</span> {declaration.motherLastName}</div>
            <div><span className="text-muted-foreground">Prénom(s) :</span> {declaration.motherFirstNames}</div>
            <div><span className="text-muted-foreground">Date de naissance :</span> {formatDate(declaration.motherBirthDate)}</div>
            <div><span className="text-muted-foreground">Nationalité :</span> {declaration.motherNationality || '-'}</div>
            <div><span className="text-muted-foreground">Profession :</span> {declaration.motherProfession || '-'}</div>
            <div><span className="text-muted-foreground">Adresse :</span> {declaration.motherAddress || '-'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du déclarant</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div><span className="text-muted-foreground">Nom :</span> {declaration.declarantLastName}</div>
          <div><span className="text-muted-foreground">Prénom(s) :</span> {declaration.declarantFirstNames}</div>
          <div><span className="text-muted-foreground">Qualité :</span> {declaration.declarantQuality}</div>
        </CardContent>
      </Card>

      {(declaration.agentComment || declaration.processedByName) && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traitement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {declaration.processedByName && (
                <div><span className="text-muted-foreground">Traité par :</span> {declaration.processedByName}</div>
              )}
              {declaration.processingDate && (
                <div><span className="text-muted-foreground">Date :</span> {formatDate(declaration.processingDate)}</div>
              )}
              {declaration.agentComment && (
                <div>
                  <span className="text-muted-foreground">Commentaire :</span>
                  <p className="mt-1 rounded bg-muted p-3">{declaration.agentComment}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
