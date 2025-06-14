import { Song, Liturgy, User, Repertoire } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  photoUrl: 'https://avatars.githubusercontent.com/u/1?v=4'
};

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Acolhe Senhor',
    artist: 'Ministério Amor e Adoração',
    lyrics: 'Primeira estrofe da música\nSegunda linha da primeira estrofe\n\nSegunda estrofe da música\nSegunda linha da segunda estrofe',
    chords: 'G D Em C',
    tone: 'G',
    tags: ['ofertório', 'louvor'],
    moments: ['ofertorio'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Eu Vim Para Escutar',
    artist: 'Pe. Zezinho',
    lyrics: 'Refrão da música de entrada\nSegunda linha do refrão\n\nPrimeira estrofe\nSegunda linha da primeira estrofe',
    chords: 'C G Am F',
    tone: 'C',
    tags: ['entrada', 'acolhida'],
    moments: ['entrada'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    title: 'Santo',
    artist: 'Tradicional',
    lyrics: 'Santo, Santo, Santo\nSenhor Deus do universo...',
    chords: 'D A Bm G',
    tone: 'D',
    tags: ['santo', 'liturgia'],
    moments: ['santo'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '4',
    title: 'Cordeiro de Deus',
    artist: 'Tradicional',
    lyrics: 'Cordeiro de Deus que tirais o pecado do mundo...',
    chords: 'Em C D G',
    tone: 'Em',
    tags: ['cordeiro', 'liturgia'],
    moments: ['cordeiro'],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: '5',
    title: 'Glória a Deus nas Alturas',
    artist: 'Tradicional',
    lyrics: 'Glória a Deus nas alturas\nE paz na terra aos homens...',
    chords: 'C F G Am',
    tone: 'C',
    tags: ['gloria', 'liturgia'],
    moments: ['gloria'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '6',
    title: 'Senhor, Piedade',
    artist: 'Tradicional',
    lyrics: 'Senhor, piedade de nós\nCristo, piedade de nós...',
    chords: 'Am F G C',
    tone: 'Am',
    tags: ['perdao', 'liturgia'],
    moments: ['perdao'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')
  },
  {
    id: '7',
    title: 'Aleluia',
    artist: 'Tradicional',
    lyrics: 'Aleluia, Aleluia, Aleluia!',
    chords: 'G C D Em',
    tone: 'G',
    tags: ['aclamacao', 'liturgia'],
    moments: ['aclamacao'],
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07')
  },
  {
    id: '8',
    title: 'Vem, Senhor Jesus',
    artist: 'Comunidade Canção Nova',
    lyrics: 'Vem, Senhor Jesus\nVem habitar em mim...',
    chords: 'D A G Em',
    tone: 'D',
    tags: ['comunhao', 'adoracao'],
    moments: ['comunhao'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '9',
    title: 'Te Agradeço',
    artist: 'Rosa de Saron',
    lyrics: 'Te agradeço Senhor\nPor tudo que tens feito...',
    chords: 'C G Am F',
    tone: 'C',
    tags: ['acao_gracas', 'louvor'],
    moments: ['acao_gracas'],
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: '10',
    title: 'Ide Por Todo Mundo',
    artist: 'Pe. Jonas Abib',
    lyrics: 'Ide por todo mundo\nAnunciai o Evangelho...',
    chords: 'G D Em C',
    tone: 'G',
    tags: ['final', 'envio'],
    moments: ['final'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

export const mockLiturgy: Liturgy = {
  date: new Date(),
  readings: {
    first: 'Leitura do Livro do Profeta Isaías',
    psalm: 'Salmo 23 - O Senhor é meu pastor, nada me faltará',
    second: 'Leitura da Carta de São Paulo aos Coríntios',
    gospel: 'Evangelho de Jesus Cristo segundo São João'
  },
  liturgicalColor: 'verde',
  celebration: 'Tempo Comum - 15º Domingo',
  suggestedSongs: [mockSongs[1], mockSongs[0], mockSongs[2]]
};

export const mockRepertoire: Repertoire = {
  id: '1',
  date: new Date(),
  songs: [
    { moment: 'entrada', song: mockSongs[1] },
    { moment: 'perdao', song: mockSongs[5] },
    { moment: 'gloria', song: mockSongs[4] },
    { moment: 'aclamacao', song: mockSongs[6] },
    { moment: 'ofertorio', song: mockSongs[0] },
    { moment: 'santo', song: mockSongs[2] },
    { moment: 'cordeiro', song: mockSongs[3] },
    { moment: 'comunhao', song: mockSongs[7] },
    { moment: 'acao_gracas', song: mockSongs[8] },
    { moment: 'final', song: mockSongs[9] }
  ],
  notes: 'Repertório para missa dominical',
  createdBy: mockUser,
  createdAt: new Date(),
  updatedAt: new Date()
};