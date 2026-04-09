// TODO: Passer à false quand le backend est prêt
export const MOCK_MODE = true;

import type { Declaration, DeclarationFormData, DeclarationStatus, Role, Stats, User } from '@/types';

// ── Utilisateurs mock ──────────────────────────────────────────────

let mockUsers: User[] = [
  { id: 1, email: 'admin@mairie.fr', firstName: 'Fatou', lastName: 'Diallo', role: 'ADMIN', createdAt: '2025-01-10T08:00:00' },
  { id: 2, email: 'agent@mairie.fr', firstName: 'Mamadou', lastName: 'Traoré', role: 'AGENT', createdAt: '2025-02-15T09:00:00' },
  { id: 3, email: 'citoyen@test.fr', firstName: 'Aminata', lastName: 'Konaté', role: 'CITIZEN', createdAt: '2025-03-01T10:00:00' },
  { id: 4, email: 'jean@test.fr', firstName: 'Jean', lastName: 'Dupont', role: 'CITIZEN', createdAt: '2025-03-20T14:00:00' },
  { id: 5, email: 'marie@test.fr', firstName: 'Marie', lastName: 'Camara', role: 'CITIZEN', createdAt: '2025-04-05T11:30:00' },
];

// ── Déclarations mock ──────────────────────────────────────────────

let nextId = 7;

let mockDeclarations: Declaration[] = [
  {
    id: 1,
    reference: 'DN-2025-0001',
    childLastName: 'Konaté',
    childFirstNames: 'Ibrahim',
    childBirthDate: '2025-03-15',
    childBirthPlace: 'Maternité Centrale',
    childGender: 'Masculin',
    fatherLastName: 'Konaté',
    fatherFirstNames: 'Moussa',
    fatherBirthDate: '1990-05-20',
    fatherNationality: 'Malienne',
    fatherProfession: 'Enseignant',
    fatherAddress: '123 Rue de Bamako',
    motherLastName: 'Diarra',
    motherFirstNames: 'Aminata',
    motherBirthDate: '1993-08-10',
    motherNationality: 'Malienne',
    motherProfession: 'Infirmière',
    motherAddress: '123 Rue de Bamako',
    declarantLastName: 'Konaté',
    declarantFirstNames: 'Moussa',
    declarantQuality: 'Père',
    status: 'APPROVED',
    agentComment: 'Dossier complet, déclaration approuvée.',
    declarationDate: '2025-03-15',
    processingDate: '2025-03-17',
    createdByName: 'Aminata Konaté',
    processedByName: 'Mamadou Traoré',
    createdAt: '2025-03-15T09:30:00',
  },
  {
    id: 2,
    reference: 'DN-2025-0002',
    childLastName: 'Dupont',
    childFirstNames: 'Léa Sophie',
    childBirthDate: '2025-04-01',
    childBirthPlace: 'Clinique du Plateau',
    childGender: 'Féminin',
    fatherLastName: 'Dupont',
    fatherFirstNames: 'Jean',
    fatherBirthDate: '1988-12-05',
    fatherNationality: 'Française',
    fatherProfession: 'Ingénieur',
    fatherAddress: '45 Avenue de la République',
    motherLastName: 'Martin',
    motherFirstNames: 'Claire',
    motherBirthDate: '1991-07-22',
    motherNationality: 'Française',
    motherProfession: 'Avocate',
    motherAddress: '45 Avenue de la République',
    declarantLastName: 'Dupont',
    declarantFirstNames: 'Jean',
    declarantQuality: 'Père',
    status: 'SUBMITTED',
    declarationDate: '2025-04-01',
    createdByName: 'Jean Dupont',
    createdAt: '2025-04-01T14:00:00',
  },
  {
    id: 3,
    reference: 'DN-2025-0003',
    childLastName: 'Camara',
    childFirstNames: 'Oumar',
    childBirthDate: '2025-04-05',
    childBirthPlace: 'Hôpital Gabriel Touré',
    childGender: 'Masculin',
    fatherLastName: 'Camara',
    fatherFirstNames: 'Sékou',
    fatherBirthDate: '1985-03-18',
    fatherNationality: 'Guinéenne',
    fatherProfession: 'Commerçant',
    fatherAddress: '78 Boulevard du Commerce',
    motherLastName: 'Camara',
    motherFirstNames: 'Marie',
    motherBirthDate: '1992-11-30',
    motherNationality: 'Guinéenne',
    motherProfession: 'Pharmacienne',
    motherAddress: '78 Boulevard du Commerce',
    declarantLastName: 'Camara',
    declarantFirstNames: 'Marie',
    declarantQuality: 'Mère',
    status: 'IN_REVIEW',
    declarationDate: '2025-04-05',
    createdByName: 'Marie Camara',
    createdAt: '2025-04-05T11:00:00',
  },
  {
    id: 4,
    reference: 'DN-2025-0004',
    childLastName: 'Konaté',
    childFirstNames: 'Fatoumata',
    childBirthDate: '2025-04-08',
    childBirthPlace: 'Maternité Centrale',
    childGender: 'Féminin',
    motherLastName: 'Konaté',
    motherFirstNames: 'Aminata',
    motherBirthDate: '1993-08-10',
    motherNationality: 'Malienne',
    motherProfession: 'Infirmière',
    motherAddress: '123 Rue de Bamako',
    declarantLastName: 'Konaté',
    declarantFirstNames: 'Aminata',
    declarantQuality: 'Mère',
    status: 'DRAFT',
    createdByName: 'Aminata Konaté',
    createdAt: '2025-04-08T16:00:00',
  },
  {
    id: 5,
    reference: 'DN-2025-0005',
    childLastName: 'Dupont',
    childFirstNames: 'Lucas',
    childBirthDate: '2025-02-20',
    childBirthPlace: 'Clinique du Plateau',
    childGender: 'Masculin',
    fatherLastName: 'Dupont',
    fatherFirstNames: 'Jean',
    fatherBirthDate: '1988-12-05',
    fatherNationality: 'Française',
    fatherProfession: 'Ingénieur',
    fatherAddress: '45 Avenue de la République',
    motherLastName: 'Martin',
    motherFirstNames: 'Claire',
    motherBirthDate: '1991-07-22',
    motherNationality: 'Française',
    motherProfession: 'Avocate',
    motherAddress: '45 Avenue de la République',
    declarantLastName: 'Dupont',
    declarantFirstNames: 'Jean',
    declarantQuality: 'Père',
    status: 'REJECTED',
    agentComment: 'Pièces justificatives manquantes. Veuillez fournir un certificat médical.',
    declarationDate: '2025-02-20',
    processingDate: '2025-02-25',
    createdByName: 'Jean Dupont',
    processedByName: 'Mamadou Traoré',
    createdAt: '2025-02-20T10:15:00',
  },
  {
    id: 6,
    reference: 'DN-2025-0006',
    childLastName: 'Camara',
    childFirstNames: 'Aïssatou',
    childBirthDate: '2025-04-07',
    childBirthPlace: 'Hôpital Gabriel Touré',
    childGender: 'Féminin',
    fatherLastName: 'Camara',
    fatherFirstNames: 'Sékou',
    fatherBirthDate: '1985-03-18',
    fatherNationality: 'Guinéenne',
    fatherProfession: 'Commerçant',
    fatherAddress: '78 Boulevard du Commerce',
    motherLastName: 'Camara',
    motherFirstNames: 'Marie',
    motherBirthDate: '1992-11-30',
    motherNationality: 'Guinéenne',
    motherProfession: 'Pharmacienne',
    motherAddress: '78 Boulevard du Commerce',
    declarantLastName: 'Camara',
    declarantFirstNames: 'Sékou',
    declarantQuality: 'Père',
    status: 'SUBMITTED',
    declarationDate: '2025-04-07',
    createdByName: 'Marie Camara',
    createdAt: '2025-04-07T08:45:00',
  },
];

// ── Helpers ────────────────────────────────────────────────────────

function getCurrentUserEmail(): string {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as { email: string };
      return user.email;
    }
  } catch { /* ignore */ }
  return '';
}

function getCurrentUserName(): string {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as { firstName: string; lastName: string };
      return `${user.firstName} ${user.lastName}`;
    }
  } catch { /* ignore */ }
  return 'Utilisateur';
}

function generateReference(): string {
  const num = mockDeclarations.length + 1;
  return `DN-2025-${String(num).padStart(4, '0')}`;
}

// ── Fonctions mock : Déclarations ──────────────────────────────────

export function mockGetMyDeclarations(): Declaration[] {
  const email = getCurrentUserEmail();
  const user = mockUsers.find((u) => u.email === email);
  if (!user) return mockDeclarations;
  const name = `${user.firstName} ${user.lastName}`;
  return mockDeclarations.filter((d) => d.createdByName === name);
}

export function mockGetPendingDeclarations(): Declaration[] {
  return mockDeclarations.filter((d) => d.status === 'SUBMITTED' || d.status === 'IN_REVIEW');
}

export function mockGetAllDeclarations(): Declaration[] {
  return [...mockDeclarations];
}

export function mockGetDeclarationById(id: number): Declaration | undefined {
  return mockDeclarations.find((d) => d.id === id);
}

export function mockCreateDeclaration(data: DeclarationFormData): Declaration {
  const now = new Date().toISOString();
  const declaration: Declaration = {
    id: nextId++,
    reference: generateReference(),
    ...data,
    status: 'DRAFT' as DeclarationStatus,
    createdByName: getCurrentUserName(),
    createdAt: now,
  };
  mockDeclarations = [declaration, ...mockDeclarations];
  return declaration;
}

export function mockSubmitDeclaration(id: number): Declaration | undefined {
  mockDeclarations = mockDeclarations.map((d) =>
    d.id === id ? { ...d, status: 'SUBMITTED' as DeclarationStatus, declarationDate: new Date().toISOString().split('T')[0] } : d
  );
  return mockDeclarations.find((d) => d.id === id);
}

export function mockSetInReview(id: number): Declaration | undefined {
  mockDeclarations = mockDeclarations.map((d) =>
    d.id === id && d.status === 'SUBMITTED' ? { ...d, status: 'IN_REVIEW' as DeclarationStatus } : d
  );
  return mockDeclarations.find((d) => d.id === id);
}

export function mockReviewDeclaration(id: number, approved: boolean, comment: string): Declaration | undefined {
  const now = new Date().toISOString();
  const agentName = getCurrentUserName();
  mockDeclarations = mockDeclarations.map((d) =>
    d.id === id
      ? {
          ...d,
          status: (approved ? 'APPROVED' : 'REJECTED') as DeclarationStatus,
          agentComment: comment,
          processingDate: now.split('T')[0],
          processedByName: agentName,
        }
      : d
  );
  return mockDeclarations.find((d) => d.id === id);
}

// ── Fonctions mock : Admin ─────────────────────────────────────────

export function mockGetStats(): Stats {
  return {
    totalDeclarations: mockDeclarations.length,
    pendingDeclarations: mockDeclarations.filter((d) => d.status === 'SUBMITTED' || d.status === 'IN_REVIEW').length,
    approvedDeclarations: mockDeclarations.filter((d) => d.status === 'APPROVED').length,
    rejectedDeclarations: mockDeclarations.filter((d) => d.status === 'REJECTED').length,
    totalUsers: mockUsers.length,
    totalCitizens: mockUsers.filter((u) => u.role === 'CITIZEN').length,
    totalAgents: mockUsers.filter((u) => u.role === 'AGENT').length,
  };
}

export function mockGetUsers(): User[] {
  return [...mockUsers];
}

export function mockChangeUserRole(userId: number, newRole: Role): void {
  mockUsers = mockUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
}
