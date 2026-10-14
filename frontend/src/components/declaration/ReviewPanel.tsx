import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormAlert } from '@/components/common/FormError';

interface Props {
  onReview: (approved: boolean, comment: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export default function ReviewPanel({ onReview, isLoading, error }: Props) {
  const [comment, setComment] = useState('');
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const hasComment = comment.trim().length > 0;

  return (
    <section className="rounded-card bg-card p-7 shadow-card">
      <h2 className="text-[21px] font-semibold">Votre décision</h2>
      <div className="mt-5 space-y-2">
        <Label htmlFor="comment">Commentaire</Label>
        <Textarea
          id="comment"
          placeholder="Motif de la décision, pièces manquantes…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          aria-describedby="comment-hint"
        />
        <p id="comment-hint" className="text-[13px] text-muted-foreground">
          Obligatoire. Le déclarant verra ce commentaire dans son espace.
        </p>
      </div>

      {error && (
        <div className="mt-5">
          <FormAlert message={error} />
        </div>
      )}

      {confirmAction ? (
        <div className="mt-6 rounded-lg bg-muted p-5">
          <p className="text-[17px] font-medium">
            {confirmAction === 'approve' ? 'Approuver cette déclaration ?' : 'Rejeter cette déclaration ?'}
          </p>
          <p className="mt-1 text-[15px] text-muted-foreground">Cette décision est définitive.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant={confirmAction === 'approve' ? 'success' : 'destructive'}
              onClick={() => onReview(confirmAction === 'approve', comment.trim())}
              disabled={isLoading}
            >
              {isLoading ? 'Traitement…' : confirmAction === 'approve' ? 'Oui, approuver' : 'Oui, rejeter'}
            </Button>
            <Button variant="secondary" onClick={() => setConfirmAction(null)} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="success" size="lg" onClick={() => setConfirmAction('approve')} disabled={!hasComment}>
            Approuver
          </Button>
          <Button variant="destructive" size="lg" onClick={() => setConfirmAction('reject')} disabled={!hasComment}>
            Rejeter
          </Button>
        </div>
      )}
    </section>
  );
}
