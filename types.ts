
export enum Role {
  CHAMPION = 'Champion',
  INFLUENCER = 'Influencer',
  EVALUATOR = 'Evaluator',
  EXECUTIVE_SPONSOR = 'Executive Sponsor',
  SIGNER = 'Signer',
  DETRACTOR = 'Detractor',
}

export type RoleKey = keyof typeof Role;

export interface Account {
  id: string;
  name: string;
  notes?: string;
  created_at: string;
}

export interface Stakeholder {
  id: string;
  account_id: string;
  name: string;
  title: string;
  responsibilities?: string;
  role: Role;
  x_pos: number;
  y_pos: number;
  notes?: string;
  created_at: string;
}
