import type { Declaration } from '@/types';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** Recherche insensible à la casse et aux accents sur la référence, l'enfant et le déclarant. */
export function matchesQuery(declaration: Declaration, query: string): boolean {
  const q = normalize(query.trim());
  if (!q) return true;
  return [
    declaration.reference,
    declaration.childFirstNames,
    declaration.childLastName,
    declaration.createdByName,
  ].some((field) => normalize(field ?? '').includes(q));
}
