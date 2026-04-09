import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeclarationStatusBadge from './DeclarationStatusBadge';
import type { Declaration } from '@/types';

interface Props {
  declaration: Declaration;
  linkPrefix: string;
}

export default function DeclarationCard({ declaration, linkPrefix }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{declaration.reference}</CardTitle>
          <DeclarationStatusBadge status={declaration.status} />
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Enfant :</span>{' '}
              <span className="font-medium">
                {declaration.childFirstNames} {declaration.childLastName}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Né(e) le :</span>{' '}
              {new Date(declaration.childBirthDate).toLocaleDateString('fr-FR')}
            </p>
            <p>
              <span className="text-muted-foreground">Lieu :</span> {declaration.childBirthPlace}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Déclaré le {new Date(declaration.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" render={<Link to={`${linkPrefix}/${declaration.id}`} />}>
              Voir détails
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
