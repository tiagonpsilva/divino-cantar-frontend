export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics?: string;
  chords?: string;
  tone: string;
  tags: string[];
  moments: MassMoment[];
  createdAt: Date;
  updatedAt: Date;
}

export type MassMoment = 
  | 'entrada'
  | 'perdao'
  | 'gloria'
  | 'salmo'
  | 'aclamacao'
  | 'ofertorio'
  | 'santo'
  | 'cordeiro'
  | 'comunhao'
  | 'acao_gracas'
  | 'final'
  | 'quaresma'
  | 'natal'
  | 'especial';

export interface Liturgy {
  date: Date;
  readings: {
    first?: string;
    psalm?: string;
    second?: string;
    gospel?: string;
  };
  liturgicalColor?: 'verde' | 'roxo' | 'branco' | 'vermelho' | 'rosa';
  celebration?: string;
  suggestedSongs?: Song[];
}

export interface Repertoire {
  id: string;
  date: Date;
  songs: {
    moment: MassMoment;
    song: Song;
  }[];
  notes?: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}