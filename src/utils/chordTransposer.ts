// Utility for transposing musical chords

const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_SCALE = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const CHORD_REGEX = /([A-G][b#]?)([^\s\/]*)(\/[A-G][b#]?)?/g;

export function getScalePosition(note: string): number {
  // Normalize the note (handle both sharps and flats)
  const normalizedNote = note.replace('b', '#');
  const sharpIndex = CHROMATIC_SCALE.indexOf(normalizedNote);
  
  if (sharpIndex !== -1) return sharpIndex;
  
  // Try with flats
  const flatIndex = FLAT_SCALE.indexOf(note);
  return flatIndex !== -1 ? flatIndex : 0;
}

export function transposeNote(note: string, semitones: number, useFlats = false): string {
  const scale = useFlats ? FLAT_SCALE : CHROMATIC_SCALE;
  const position = getScalePosition(note);
  const newPosition = (position + semitones + 12) % 12;
  return scale[newPosition];
}

export function transposeChord(chord: string, semitones: number, useFlats = false): string {
  return chord.replace(CHORD_REGEX, (_, root, quality, bass) => {
    const newRoot = transposeNote(root, semitones, useFlats);
    const newBass = bass ? '/' + transposeNote(bass.substring(1), semitones, useFlats) : '';
    return newRoot + quality + newBass;
  });
}

export function transposeChordLine(chordLine: string, semitones: number, useFlats = false): string {
  // Split by spaces and transpose each chord
  return chordLine.split(/(\s+)/).map(part => {
    if (/^\s+$/.test(part)) {
      // Preserve whitespace
      return part;
    }
    
    // Check if this part contains chords
    if (CHORD_REGEX.test(part)) {
      return transposeChord(part, semitones, useFlats);
    }
    
    return part;
  }).join('');
}

export function getSemitonesFromKeys(fromKey: string, toKey: string): number {
  const fromPosition = getScalePosition(fromKey);
  const toPosition = getScalePosition(toKey);
  return (toPosition - fromPosition + 12) % 12;
}

export function getKeyFromSemitones(originalKey: string, semitones: number, useFlats = false): string {
  return transposeNote(originalKey, semitones, useFlats);
}

// Utility to detect if chords should use flats or sharps based on key
export function shouldUseFlats(key: string): boolean {
  const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
  return flatKeys.includes(key);
}

// Advanced transposition for full chord progressions
export function transposeProgression(progression: string[], semitones: number, useFlats = false): string[] {
  return progression.map(chord => transposeChord(chord, semitones, useFlats));
}

// Parse and transpose a full lyrics+chords text
export function transposeLyricsWithChords(text: string, semitones: number, useFlats = false): string {
  const lines = text.split('\n');
  
  return lines.map(line => {
    // Check if line appears to be primarily chords (common patterns)
    const wordCount = line.trim().split(/\s+/).length;
    const chordMatches = line.match(CHORD_REGEX) || [];
    
    // If more than 50% of words look like chords, transpose the whole line
    if (chordMatches.length > 0 && chordMatches.length / wordCount > 0.3) {
      return transposeChordLine(line, semitones, useFlats);
    }
    
    return line;
  }).join('\n');
}