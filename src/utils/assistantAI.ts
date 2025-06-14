import { mockSongs } from '../data/mock';
import { Song, MassMoment } from '../types';

export interface AssistantResponse {
  content: string;
  suggestedSongs?: Song[];
  actions?: {
    id: string;
    label: string;
    icon: string;
    action: string;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export class AssistantAI {
  private static liturgicalColors = {
    verde: 'Verde - Tempo Comum',
    roxo: 'Roxo - Advento, Quaresma',
    branco: 'Branco - Natal, Páscoa, festas de santos',
    vermelho: 'Vermelho - Domingo de Ramos, Pentecostes, mártires',
    rosa: 'Rosa - 3º domingo do Advento, 4º da Quaresma'
  };

  private static momentTranslations: Record<string, MassMoment> = {
    'entrada': 'entrada',
    'abertura': 'entrada',
    'acolhida': 'entrada',
    'perdão': 'perdao',
    'penitencial': 'perdao',
    'glória': 'gloria',
    'gloria': 'gloria',
    'salmo': 'salmo',
    'responsorial': 'salmo',
    'aclamação': 'aclamacao',
    'aclamacao': 'aclamacao',
    'aleluia': 'aclamacao',
    'ofertório': 'ofertorio',
    'ofertorio': 'ofertorio',
    'santo': 'santo',
    'cordeiro': 'cordeiro',
    'comunhão': 'comunhao',
    'comunhao': 'comunhao',
    'ação de graças': 'acao_gracas',
    'acao de gracas': 'acao_gracas',
    'final': 'final',
    'envio': 'final',
    'saída': 'final'
  };

  public static analyzeIntent(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Music-related intents
    if (this.containsAny(lowerInput, ['música', 'musica', 'canção', 'cancao', 'cantar', 'repertório', 'repertorio'])) {
      return 'music_query';
    }
    
    // Liturgical moment intents
    if (this.containsAny(lowerInput, Object.keys(this.momentTranslations))) {
      return 'moment_query';
    }
    
    // Technical intents
    if (this.containsAny(lowerInput, ['transpor', 'tom', 'acorde', 'cifra', 'transposição', 'transposicao'])) {
      return 'technical_query';
    }
    
    // Liturgical intents
    if (this.containsAny(lowerInput, ['litúrgico', 'liturgico', 'cor', 'tempo', 'celebração', 'celebracao', 'festa'])) {
      return 'liturgical_query';
    }
    
    // Planning intents
    if (this.containsAny(lowerInput, ['planejar', 'planejamento', 'missa', 'celebração', 'celebracao', 'criar', 'organizar'])) {
      return 'planning_query';
    }
    
    // Personal intents
    if (this.containsAny(lowerInput, ['favorito', 'favorita', 'meus', 'minhas', 'pessoal'])) {
      return 'personal_query';
    }
    
    return 'general_query';
  }

  public static extractMoment(input: string): MassMoment | null {
    const lowerInput = input.toLowerCase();
    
    for (const [keyword, moment] of Object.entries(this.momentTranslations)) {
      if (lowerInput.includes(keyword)) {
        return moment;
      }
    }
    
    return null;
  }

  public static generateMomentResponse(moment: MassMoment): AssistantResponse {
    const songs = mockSongs.filter(song => song.moments.includes(moment));
    const momentName = this.getMomentDisplayName(moment);
    
    const tips = {
      entrada: 'Para a entrada, escolha músicas que criem um ambiente de acolhimento e preparação para a celebração.',
      perdao: 'O ato penitencial pede músicas que expressem arrependimento e busca pelo perdão divino.',
      gloria: 'O Glória é um hino de louvor. Prefira músicas alegres e festivas.',
      salmo: 'O salmo responsorial deve refletir o tema das leituras do dia.',
      aclamacao: 'A aclamação ao Evangelho prepara para a Palavra. Use "Aleluia" ou equivalente.',
      ofertorio: 'No ofertório, músicas contemplativas que preparem para a consagração.',
      santo: 'O Santo é um hino de adoração. Prefira melodias solenes e reverentes.',
      cordeiro: 'O Cordeiro de Deus prepara para a comunhão. Música suave e contemplativa.',
      comunhao: 'Na comunhão, músicas que expressem união com Cristo e a comunidade.',
      acao_gracas: 'Após a comunhão, músicas de gratidão e contemplação.',
      final: 'A música final deve enviar a comunidade em missão, com alegria e esperança.',
      quaresma: 'Na Quaresma, prefira músicas contemplativas e penitenciais.',
      natal: 'No Natal, músicas alegres que celebrem o nascimento de Jesus.',
      especial: 'Para celebrações especiais, adapte o repertório ao tema da festa.'
    };

    return {
      content: `🎵 **${momentName}**\n\n${tips[moment]}\n\nEncontrei ${songs.length} música(s) adequada(s) para este momento:`,
      suggestedSongs: songs.slice(0, 5), // Limit to 5 songs
      actions: [
        {
          id: 'add-to-planning',
          label: 'Adicionar ao Planejamento',
          icon: 'Plus',
          action: 'add_to_planning'
        },
        {
          id: 'see-more',
          label: 'Ver Mais Músicas',
          icon: 'Search',
          action: 'search_moment'
        }
      ]
    };
  }

  public static generateTechnicalResponse(query: string): AssistantResponse {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('transpor') || lowerQuery.includes('tom')) {
      return {
        content: `🎼 **Transposição de Acordes**\n\nPara transpor uma música:\n\n1. Vá para a página de **Cifras**\n2. Use os botões ⬆️⬇️ ou o seletor de tom\n3. O sistema transpõe automaticamente todos os acordes\n\n**Dicas:**\n• Tons graves (C, D, E) são mais fáceis para iniciantes\n• Use o botão 🔄 para voltar ao tom original\n• Considere a tessitura vocal da assembleia`,
        actions: [
          {
            id: 'go-chords',
            label: 'Ir para Cifras',
            icon: 'Music',
            action: 'navigate_chords'
          }
        ]
      };
    }
    
    if (lowerQuery.includes('acorde') || lowerQuery.includes('cifra')) {
      return {
        content: `🎸 **Cifras e Acordes**\n\nNossas cifras incluem:\n• Progressões harmônicas simplificadas\n• Transposição automática\n• Formato legível para músicos\n\n**Como usar:**\n1. Selecione uma música no repertório\n2. Clique em "Ver cifra"\n3. Ajuste o tom conforme necessário\n4. Use para ensaios e apresentações`,
        actions: [
          {
            id: 'browse-chords',
            label: 'Explorar Cifras',
            icon: 'Music',
            action: 'navigate_chords'
          }
        ]
      };
    }
    
    return {
      content: `🔧 **Ajuda Técnica**\n\nPosso ajudar com:\n• Transposição de acordes\n• Explicação de cifras\n• Dicas de execução musical\n• Configurações do sistema\n\nO que você gostaria de saber especificamente?`
    };
  }

  public static generateLiturgicalResponse(query: string): AssistantResponse {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('cor') || lowerQuery.includes('cores')) {
      const colorList = Object.entries(this.liturgicalColors)
        .map(([color, description]) => `${this.getColorEmoji(color)} **${description}**`)
        .join('\n');
      
      return {
        content: `🎨 **Cores Litúrgicas**\n\n${colorList}\n\nAs cores litúrgicas orientam a escolha do repertório e ajudam a criar a atmosfera adequada para cada celebração.`,
        actions: [
          {
            id: 'check-today',
            label: 'Ver Liturgia de Hoje',
            icon: 'Calendar',
            action: 'navigate_liturgy'
          }
        ]
      };
    }
    
    if (lowerQuery.includes('tempo')) {
      return {
        content: `📅 **Tempos Litúrgicos**\n\n🟢 **Tempo Comum**: Crescimento na fé e vida cristã\n🟣 **Advento**: Preparação para o Natal\n🎄 **Natal**: Celebração do nascimento de Jesus\n🟣 **Quaresma**: Preparação penitencial para a Páscoa\n🌅 **Páscoa**: Celebração da Ressurreição\n\nCada tempo tem características musicais específicas que devem influenciar a escolha do repertório.`
      };
    }
    
    return {
      content: `⛪ **Informações Litúrgicas**\n\nPosso ajudar com:\n• Cores litúrgicas do ano\n• Características dos tempos litúrgicos\n• Orientações para celebrações específicas\n• Adaptação do repertório ao calendário\n\nSobre o que você gostaria de saber?`
    };
  }

  public static generatePlaylistResponse(occasion: string, favorites: string[]): AssistantResponse {
    let songs: Song[] = [];
    let title = '';
    let description = '';
    
    const lowerOccasion = occasion.toLowerCase();
    
    if (lowerOccasion.includes('ramos')) {
      title = 'Domingo de Ramos';
      description = 'Repertório especial para a entrada triunfal de Jesus em Jerusalém';
      songs = [
        ...mockSongs.filter(s => s.moments.includes('entrada')).slice(0, 2),
        ...mockSongs.filter(s => s.moments.includes('ofertorio')).slice(0, 1),
        ...mockSongs.filter(s => s.moments.includes('comunhao')).slice(0, 2)
      ];
    } else if (lowerOccasion.includes('natal')) {
      title = 'Celebração de Natal';
      description = 'Repertório festivo para celebrar o nascimento de Jesus';
      songs = mockSongs.filter(s => s.moments.includes('natal') || s.tags.includes('Natal')).slice(0, 5);
    } else if (lowerOccasion.includes('páscoa') || lowerOccasion.includes('pascoa')) {
      title = 'Celebração Pascal';
      description = 'Repertório alegre para celebrar a Ressurreição';
      songs = mockSongs.filter(s => s.tags.includes('Páscoa') || s.tags.includes('Aleluia')).slice(0, 5);
    } else if (lowerOccasion.includes('favorita')) {
      title = 'Suas Músicas Favoritas';
      description = `Você tem ${favorites.length} música(s) marcada(s) como favorita(s)`;
      songs = mockSongs.filter(s => favorites.includes(s.id));
    } else {
      // Default Sunday mass
      title = 'Missa Dominical';
      description = 'Repertório completo para uma celebração dominical';
      songs = [
        mockSongs.find(s => s.moments.includes('entrada')),
        mockSongs.find(s => s.moments.includes('salmo')),
        mockSongs.find(s => s.moments.includes('ofertorio')),
        mockSongs.find(s => s.moments.includes('comunhao')),
        mockSongs.find(s => s.moments.includes('final'))
      ].filter(Boolean) as Song[];
    }
    
    return {
      content: `🎼 **${title}**\n\n${description}\n\n${songs.length > 0 ? 'Aqui está uma sugestão de repertório:' : 'Não encontrei músicas específicas para esta ocasião.'}`,
      suggestedSongs: songs,
      actions: songs.length > 0 ? [
        {
          id: 'create-planning',
          label: 'Criar Planejamento Completo',
          icon: 'Plus',
          action: 'create_planning'
        },
        {
          id: 'export-playlist',
          label: 'Exportar Lista',
          icon: 'Download',
          action: 'export_playlist'
        }
      ] : []
    };
  }

  private static containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private static getMomentDisplayName(moment: MassMoment): string {
    const names: Record<MassMoment, string> = {
      entrada: 'Canto de Entrada',
      perdao: 'Ato Penitencial',
      gloria: 'Glória',
      salmo: 'Salmo Responsorial',
      aclamacao: 'Aclamação ao Evangelho',
      ofertorio: 'Canto do Ofertório',
      santo: 'Santo',
      cordeiro: 'Cordeiro de Deus',
      comunhao: 'Canto de Comunhão',
      acao_gracas: 'Ação de Graças',
      final: 'Canto Final',
      quaresma: 'Tempo da Quaresma',
      natal: 'Tempo do Natal',
      especial: 'Celebração Especial'
    };
    return names[moment] || moment;
  }

  private static getColorEmoji(color: string): string {
    const emojis: Record<string, string> = {
      verde: '🟢',
      roxo: '🟣',
      branco: '⚪',
      vermelho: '🔴',
      rosa: '🌸'
    };
    return emojis[color] || '🎨';
  }
}