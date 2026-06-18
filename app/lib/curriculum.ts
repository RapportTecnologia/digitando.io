// Progressive typing curriculum

export interface Phase {
  id: number;
  title: string;
  description: string;
  /** Pool of characters/keys introduced in this phase */
  chars: string[];
  /** Minimum accuracy (%) to pass */
  targetAccuracy: number;
  /** Minimum WPM to pass */
  targetWpm: number;
  /** Number of characters in a round */
  roundLength: number;
  /** Whether this is the final free-practice phase */
  freePractice?: boolean;
  /** Type of training: 'sequence' = ordered drills, 'game' = catch-the-key */
  mode: 'sequence' | 'game';
}

export const PHASES: Phase[] = [
  {
    id: 1,
    title: 'Base — Mão Esquerda',
    description: 'Linha base com a mão esquerda: A S D F G',
    chars: ['a', 's', 'd', 'f', 'g'],
    targetAccuracy: 95,
    targetWpm: 12,
    roundLength: 30,
    mode: 'sequence',
  },
  {
    id: 2,
    title: 'Base — Mão Direita',
    description: 'Linha base com a mão direita: H J K L Ç',
    chars: ['h', 'j', 'k', 'l', 'ç'],
    targetAccuracy: 95,
    targetWpm: 12,
    roundLength: 30,
    mode: 'sequence',
  },
  {
    id: 3,
    title: 'Base — Duas Mãos',
    description: 'Toda a linha base combinada',
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
    targetAccuracy: 95,
    targetWpm: 16,
    roundLength: 36,
    mode: 'game',
  },
  {
    id: 4,
    title: 'Linha Superior — Esquerda',
    description: 'Q W E R T com a mão esquerda',
    chars: ['q', 'w', 'e', 'r', 't'],
    targetAccuracy: 95,
    targetWpm: 14,
    roundLength: 30,
    mode: 'sequence',
  },
  {
    id: 5,
    title: 'Linha Superior — Direita',
    description: 'Y U I O P com a mão direita',
    chars: ['y', 'u', 'i', 'o', 'p'],
    targetAccuracy: 95,
    targetWpm: 14,
    roundLength: 30,
    mode: 'sequence',
  },
  {
    id: 6,
    title: 'Linha Superior + Base',
    description: 'Combine as linhas superior e base',
    chars: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
    targetAccuracy: 95,
    targetWpm: 20,
    roundLength: 40,
    mode: 'game',
  },
  {
    id: 7,
    title: 'Linha Inferior — Esquerda',
    description: 'Z X C V B com a mão esquerda',
    chars: ['z', 'x', 'c', 'v', 'b'],
    targetAccuracy: 95,
    targetWpm: 16,
    roundLength: 30,
    mode: 'sequence',
  },
  {
    id: 8,
    title: 'Linha Inferior — Direita',
    description: 'N M , . ; com a mão direita',
    chars: ['n', 'm', ',', '.', ';'],
    targetAccuracy: 95,
    targetWpm: 16,
    roundLength: 30,
    mode: 'sequence',
  },
  {
    id: 9,
    title: 'Alfabeto Completo',
    description: 'Todas as letras em palavras reais',
    chars: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ç', ' '],
    targetAccuracy: 95,
    targetWpm: 25,
    roundLength: 50,
    mode: 'game',
  },
  {
    id: 10,
    title: 'Números',
    description: 'Linha de números 1 a 0',
    chars: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    targetAccuracy: 95,
    targetWpm: 22,
    roundLength: 30,
    mode: 'sequence',
  },
  {
    id: 11,
    title: 'Símbolos e Pontuação',
    description: 'Símbolos comuns combinados com letras',
    chars: ['-', '=', '[', ']', ';', ',', '.', '/', "'", '~', '´', ' ', 'a', 'e', 'o', 's', 't'],
    targetAccuracy: 95,
    targetWpm: 25,
    roundLength: 40,
    mode: 'game',
  },
  {
    id: 12,
    title: 'Velocidade Total',
    description: 'Teste final de velocidade com texto completo',
    chars: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ç', ' ', ',', '.'],
    targetAccuracy: 95,
    targetWpm: 35,
    roundLength: 60,
    mode: 'game',
  },
  {
    id: 13,
    title: 'Prática Livre',
    description: 'Cole seu próprio texto e pratique livremente',
    chars: [],
    targetAccuracy: 0,
    targetWpm: 0,
    roundLength: 0,
    freePractice: true,
    mode: 'sequence',
  },
];

// Common Portuguese words for word-based phases
const WORDS: Record<number, string[]> = {
  9: ['casa', 'gato', 'pato', 'bola', 'mesa', 'dedo', 'mão', 'sol', 'lua', 'rua', 'pão', 'café', 'leite', 'verde', 'azul', 'feliz', 'doce', 'forte', 'rapido', 'livro', 'caneta', 'janela', 'porta', 'flor', 'arvore', 'vento', 'chuva', 'praia', 'campo', 'cidade'],
  11: ['e-mail', 'auto-falante', 'bem-vindo', '1,5', '3.14', 'a/b', "d'agua", 'pre-pago', 'meio-dia', 'guarda-chuva'],
  12: ['o rato roeu a roupa', 'a casa esta bonita', 'gosto de programar', 'digite com calma', 'a pratica leva a perfeicao', 'foco e disciplina', 'continue treinando', 'voce esta indo bem'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a sequence of characters to type for a given phase */
export function generateSequence(phase: Phase): string {
  if (phase.freePractice) return '';

  // Word-based phases
  if (WORDS[phase.id]) {
    const words = WORDS[phase.id];
    const parts: string[] = [];
    let len = 0;
    while (len < phase.roundLength) {
      const w = pick(words);
      parts.push(w);
      len += w.length + 1;
    }
    return parts.join(' ');
  }

  // Drill-based phases: random groups of the phase chars
  const chars = phase.chars;
  let result = '';
  while (result.length < phase.roundLength) {
    const groupSize = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < groupSize && result.length < phase.roundLength; i++) {
      result += pick(chars);
    }
    if (result.length < phase.roundLength) result += ' ';
  }
  return result.trim();
}

export function getPhase(id: number): Phase | undefined {
  return PHASES.find((p) => p.id === id);
}

export function computeStars(accuracy: number, wpm: number, phase: Phase): number {
  if (phase.freePractice) return 0;
  let stars = 0;
  if (accuracy >= phase.targetAccuracy && wpm >= phase.targetWpm) stars = 1;
  if (accuracy >= phase.targetAccuracy && wpm >= phase.targetWpm * 1.25) stars = 2;
  if (accuracy >= Math.min(99, phase.targetAccuracy + 3) && wpm >= phase.targetWpm * 1.5) stars = 3;
  return stars;
}

export function passedPhase(accuracy: number, wpm: number, phase: Phase): boolean {
  return accuracy >= phase.targetAccuracy && wpm >= phase.targetWpm;
}
