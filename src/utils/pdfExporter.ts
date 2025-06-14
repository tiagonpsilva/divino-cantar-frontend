import jsPDF from 'jspdf';

interface Song {
  id: string;
  title: string;
  artist: string;
  tone: string;
  lyrics?: string;
  chords?: string;
  moments: string[];
  tags: string[];
}

interface ExportOptions {
  includeLyrics?: boolean;
  includeChords?: boolean;
  includeArtist?: boolean;
  includeTone?: boolean;
  includeMoments?: boolean;
  title?: string;
  subtitle?: string;
  fontSize?: number;
  pageOrientation?: 'portrait' | 'landscape';
}

export class PDFExporter {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;
  private lineHeight: number = 6;

  constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
    this.pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });
    
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
  }

  private checkPageBreak(additionalHeight: number = 10): void {
    if (this.currentY + additionalHeight > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addText(text: string, fontSize: number = 10, style: 'normal' | 'bold' = 'normal'): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', style);
    
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - (this.margin * 2));
    const textHeight = lines.length * this.lineHeight;
    
    this.checkPageBreak(textHeight);
    
    lines.forEach((line: string) => {
      this.pdf.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });
    
    this.currentY += 2; // Extra spacing
  }

  private addTitle(title: string): void {
    this.addText(title, 16, 'bold');
    this.currentY += 5;
  }

  private addSubtitle(subtitle: string): void {
    this.addText(subtitle, 12, 'normal');
    this.currentY += 3;
  }

  private addSong(song: Song, options: ExportOptions): void {
    this.checkPageBreak(30); // Reserve space for song header
    
    // Song title
    this.addText(song.title, 14, 'bold');
    
    // Artist and details
    let details = [];
    if (options.includeArtist && song.artist) {
      details.push(`Artista: ${song.artist}`);
    }
    if (options.includeTone) {
      details.push(`Tom: ${song.tone}`);
    }
    if (options.includeMoments && song.moments.length > 0) {
      details.push(`Momentos: ${song.moments.join(', ')}`);
    }
    
    if (details.length > 0) {
      this.addText(details.join(' • '), 9);
    }
    
    // Separator line
    this.currentY += 2;
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 5;
    
    // Chords (if available and requested)
    if (options.includeChords && song.chords) {
      this.addText('CIFRA:', 10, 'bold');
      this.pdf.setFont('courier', 'normal'); // Monospace for chords
      this.addText(song.chords, 9);
      this.pdf.setFont('helvetica', 'normal'); // Back to normal font
      this.currentY += 3;
    }
    
    // Lyrics (if available and requested)
    if (options.includeLyrics && song.lyrics) {
      this.addText('LETRA:', 10, 'bold');
      this.addText(song.lyrics, 10);
    }
    
    this.currentY += 8; // Space between songs
  }

  exportRepertoire(songs: Song[], options: ExportOptions = {}): void {
    // Default options
    const opts: ExportOptions = {
      includeLyrics: true,
      includeChords: true,
      includeArtist: true,
      includeTone: true,
      includeMoments: true,
      title: 'Repertório Musical',
      subtitle: `DivinoCantar - ${new Date().toLocaleDateString('pt-BR')}`,
      fontSize: 10,
      pageOrientation: 'portrait',
      ...options
    };

    // Header
    if (opts.title) {
      this.addTitle(opts.title);
    }
    
    if (opts.subtitle) {
      this.addSubtitle(opts.subtitle);
    }
    
    this.currentY += 5;
    
    // Summary
    this.addText(`Total de músicas: ${songs.length}`, 10);
    this.currentY += 10;
    
    // Songs
    songs.forEach((song, index) => {
      this.addSong(song, opts);
      
      // Add page break every 3 songs (optional)
      if ((index + 1) % 3 === 0 && index < songs.length - 1) {
        this.pdf.addPage();
        this.currentY = this.margin;
      }
    });
    
    // Footer on last page
    const totalPages = this.pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(150);
      this.pdf.text(
        `Página ${i} de ${totalPages} - Gerado pelo DivinoCantar`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
    }
  }

  exportSong(song: Song, options: ExportOptions = {}): void {
    const opts: ExportOptions = {
      includeLyrics: true,
      includeChords: true,
      includeArtist: true,
      includeTone: true,
      includeMoments: true,
      title: song.title,
      subtitle: song.artist,
      ...options
    };
    
    this.addSong(song, opts);
  }

  save(filename: string): void {
    this.pdf.save(filename);
  }

  getBlob(): Blob {
    return this.pdf.output('blob');
  }
}

// Utility functions for common export scenarios
export function exportRepertoireAsPDF(
  songs: Song[], 
  filename: string = 'repertorio-musical.pdf',
  options: ExportOptions = {}
): void {
  const exporter = new PDFExporter(options.pageOrientation);
  exporter.exportRepertoire(songs, options);
  exporter.save(filename);
}

export function exportSongAsPDF(
  song: Song,
  filename?: string,
  options: ExportOptions = {}
): void {
  const exporter = new PDFExporter(options.pageOrientation);
  exporter.exportSong(song, options);
  exporter.save(filename || `${song.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf`);
}

// Export songs by liturgical moment
export function exportByMoment(
  songs: Song[],
  moment: string,
  options: ExportOptions = {}
): void {
  const filteredSongs = songs.filter(song => song.moments.includes(moment));
  const exporter = new PDFExporter(options.pageOrientation);
  
  const exportOptions = {
    ...options,
    title: `Repertório - ${moment.charAt(0).toUpperCase() + moment.slice(1)}`,
    subtitle: `${filteredSongs.length} músicas • DivinoCantar`
  };
  
  exporter.exportRepertoire(filteredSongs, exportOptions);
  exporter.save(`repertorio-${moment.toLowerCase()}.pdf`);
}