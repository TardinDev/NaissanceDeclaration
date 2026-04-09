export type Role = 'CITIZEN' | 'AGENT' | 'ADMIN';

export type DeclarationStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Declaration {
  id: number;
  reference: string;

  // Enfant
  childLastName: string;
  childFirstNames: string;
  childBirthDate: string;
  childBirthPlace: string;
  childGender: string;

  // Père
  fatherLastName?: string;
  fatherFirstNames?: string;
  fatherBirthDate?: string;
  fatherNationality?: string;
  fatherProfession?: string;
  fatherAddress?: string;

  // Mère
  motherLastName: string;
  motherFirstNames: string;
  motherBirthDate?: string;
  motherNationality?: string;
  motherProfession?: string;
  motherAddress?: string;

  // Déclarant
  declarantLastName: string;
  declarantFirstNames: string;
  declarantQuality: string;

  // Métadonnées
  status: DeclarationStatus;
  agentComment?: string;
  declarationDate?: string;
  processingDate?: string;
  createdByName: string;
  processedByName?: string;
  createdAt: string;
}

export interface DeclarationFormData {
  childLastName: string;
  childFirstNames: string;
  childBirthDate: string;
  childBirthPlace: string;
  childGender: string;

  fatherLastName: string;
  fatherFirstNames: string;
  fatherBirthDate: string;
  fatherNationality: string;
  fatherProfession: string;
  fatherAddress: string;

  motherLastName: string;
  motherFirstNames: string;
  motherBirthDate: string;
  motherNationality: string;
  motherProfession: string;
  motherAddress: string;

  declarantLastName: string;
  declarantFirstNames: string;
  declarantQuality: string;
}

export interface ReviewData {
  approved: boolean;
  comment: string;
}

export interface Stats {
  totalDeclarations: number;
  pendingDeclarations: number;
  approvedDeclarations: number;
  rejectedDeclarations: number;
  totalUsers: number;
  totalCitizens: number;
  totalAgents: number;
}
