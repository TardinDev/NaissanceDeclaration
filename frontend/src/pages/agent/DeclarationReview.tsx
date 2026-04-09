import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDeclarationStore } from '@/store/useDeclarationStore';
import DeclarationDetail from '@/components/declaration/DeclarationDetail';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DeclarationReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDeclaration, isLoading, fetchDeclarationById, reviewDeclaration, clearCurrent } =
    useDeclarationStore();
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      fetchDeclarationById(Number(id));
    }
    return () => clearCurrent();
  }, [id, fetchDeclarationById, clearCurrent]);

  const handleReview = async (approved: boolean) => {
    if (!id || !comment.trim()) return;
    await reviewDeclaration(Number(id), { approved, comment });
    navigate('/agent/dashboard');
  };

  if (isLoading) return <LoadingSpinner />;

  if (!currentDeclaration) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Déclaration non trouvée.</p>
      </div>
    );
  }

  const canReview = currentDeclaration.status === 'SUBMITTED' || currentDeclaration.status === 'IN_REVIEW';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <DeclarationDetail declaration={currentDeclaration} />

        {canReview && (
          <>
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle>Traitement de la déclaration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comment">Commentaire *</Label>
                  <Textarea
                    id="comment"
                    placeholder="Ajoutez un commentaire sur le traitement..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleReview(true)}
                    disabled={!comment.trim() || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approuver
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReview(false)}
                    disabled={!comment.trim() || isLoading}
                  >
                    Rejeter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </motion.div>
    </div>
  );
}
