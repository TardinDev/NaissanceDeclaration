export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mairie - Service d'État Civil. Tous droits réservés.</p>
        <p className="mt-1">Déclaration de Naissance en ligne</p>
      </div>
    </footer>
  );
}
