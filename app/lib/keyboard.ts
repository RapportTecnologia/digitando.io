// ABNT2 keyboard layout and finger mapping for touch typing

export type FingerId =
  | 'L-pinky'
  | 'L-ring'
  | 'L-middle'
  | 'L-index'
  | 'thumb'
  | 'R-index'
  | 'R-middle'
  | 'R-ring'
  | 'R-pinky';

export type Hand = 'left' | 'right';

export interface KeyDef {
  /** Character produced (used for matching). For letters this is lowercase. */
  key: string;
  /** Label shown on the keycap */
  label: string;
  /** Secondary label (shift symbol) */
  shiftLabel?: string;
  /** Relative width (1 = standard) */
  width?: number;
  /** Finger that should press this key */
  finger?: FingerId;
  /** Special non-character key */
  special?: 'backspace' | 'tab' | 'caps' | 'enter' | 'shift-l' | 'shift-r' | 'ctrl' | 'alt' | 'space' | 'win';
}

export const FINGER_HAND: Record<FingerId, Hand> = {
  'L-pinky': 'left',
  'L-ring': 'left',
  'L-middle': 'left',
  'L-index': 'left',
  thumb: 'left',
  'R-index': 'right',
  'R-middle': 'right',
  'R-ring': 'right',
  'R-pinky': 'right',
};

export const FINGER_LABEL: Record<FingerId, string> = {
  'L-pinky': 'Mínimo esquerdo',
  'L-ring': 'Anelar esquerdo',
  'L-middle': 'Médio esquerdo',
  'L-index': 'Indicador esquerdo',
  thumb: 'Polegar',
  'R-index': 'Indicador direito',
  'R-middle': 'Médio direito',
  'R-ring': 'Anelar direito',
  'R-pinky': 'Mínimo direito',
};

// ABNT2 layout
export const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { key: "'", label: "'", shiftLabel: '"', finger: 'L-pinky' },
    { key: '1', label: '1', shiftLabel: '!', finger: 'L-pinky' },
    { key: '2', label: '2', shiftLabel: '@', finger: 'L-ring' },
    { key: '3', label: '3', shiftLabel: '#', finger: 'L-middle' },
    { key: '4', label: '4', shiftLabel: '$', finger: 'L-index' },
    { key: '5', label: '5', shiftLabel: '%', finger: 'L-index' },
    { key: '6', label: '6', shiftLabel: '¨', finger: 'R-index' },
    { key: '7', label: '7', shiftLabel: '&', finger: 'R-index' },
    { key: '8', label: '8', shiftLabel: '*', finger: 'R-middle' },
    { key: '9', label: '9', shiftLabel: '(', finger: 'R-ring' },
    { key: '0', label: '0', shiftLabel: ')', finger: 'R-pinky' },
    { key: '-', label: '-', shiftLabel: '_', finger: 'R-pinky' },
    { key: '=', label: '=', shiftLabel: '+', finger: 'R-pinky' },
    { key: 'Backspace', label: '⌫', width: 2, finger: 'R-pinky', special: 'backspace' },
  ],
  [
    { key: 'Tab', label: 'Tab', width: 1.5, finger: 'L-pinky', special: 'tab' },
    { key: 'q', label: 'Q', finger: 'L-pinky' },
    { key: 'w', label: 'W', finger: 'L-ring' },
    { key: 'e', label: 'E', finger: 'L-middle' },
    { key: 'r', label: 'R', finger: 'L-index' },
    { key: 't', label: 'T', finger: 'L-index' },
    { key: 'y', label: 'Y', finger: 'R-index' },
    { key: 'u', label: 'U', finger: 'R-index' },
    { key: 'i', label: 'I', finger: 'R-middle' },
    { key: 'o', label: 'O', finger: 'R-ring' },
    { key: 'p', label: 'P', finger: 'R-pinky' },
    { key: '´', label: '´', shiftLabel: '`', finger: 'R-pinky' },
    { key: '[', label: '[', shiftLabel: '{', finger: 'R-pinky' },
    { key: 'Enter', label: '⏎', width: 1.5, finger: 'R-pinky', special: 'enter' },
  ],
  [
    { key: 'CapsLock', label: 'Caps', width: 1.75, finger: 'L-pinky', special: 'caps' },
    { key: 'a', label: 'A', finger: 'L-pinky' },
    { key: 's', label: 'S', finger: 'L-ring' },
    { key: 'd', label: 'D', finger: 'L-middle' },
    { key: 'f', label: 'F', finger: 'L-index' },
    { key: 'g', label: 'G', finger: 'L-index' },
    { key: 'h', label: 'H', finger: 'R-index' },
    { key: 'j', label: 'J', finger: 'R-index' },
    { key: 'k', label: 'K', finger: 'R-middle' },
    { key: 'l', label: 'L', finger: 'R-ring' },
    { key: 'ç', label: 'Ç', finger: 'R-pinky' },
    { key: '~', label: '~', shiftLabel: '^', finger: 'R-pinky' },
    { key: ']', label: ']', shiftLabel: '}', finger: 'R-pinky' },
    { key: 'Enter2', label: '', width: 1.25, finger: 'R-pinky', special: 'enter' },
  ],
  [
    { key: 'ShiftL', label: '⇧', width: 1.25, finger: 'L-pinky', special: 'shift-l' },
    { key: '\\', label: '\\', shiftLabel: '|', finger: 'L-pinky' },
    { key: 'z', label: 'Z', finger: 'L-pinky' },
    { key: 'x', label: 'X', finger: 'L-ring' },
    { key: 'c', label: 'C', finger: 'L-middle' },
    { key: 'v', label: 'V', finger: 'L-index' },
    { key: 'b', label: 'B', finger: 'L-index' },
    { key: 'n', label: 'N', finger: 'R-index' },
    { key: 'm', label: 'M', finger: 'R-index' },
    { key: ',', label: ',', shiftLabel: '<', finger: 'R-middle' },
    { key: '.', label: '.', shiftLabel: '>', finger: 'R-ring' },
    { key: ';', label: ';', shiftLabel: ':', finger: 'R-pinky' },
    { key: '/', label: '/', shiftLabel: '?', finger: 'R-pinky' },
    { key: 'ShiftR', label: '⇧', width: 2.75, finger: 'R-pinky', special: 'shift-r' },
  ],
  [
    { key: 'CtrlL', label: 'Ctrl', width: 1.5, finger: 'L-pinky', special: 'ctrl' },
    { key: 'Win', label: 'Win', width: 1.25, finger: 'L-pinky', special: 'win' },
    { key: 'AltL', label: 'Alt', width: 1.25, finger: 'thumb', special: 'alt' },
    { key: ' ', label: 'Espaço', width: 7, finger: 'thumb', special: 'space' },
    { key: 'AltR', label: 'AltGr', width: 1.25, finger: 'thumb', special: 'alt' },
    { key: 'CtrlR', label: 'Ctrl', width: 1.5, finger: 'R-pinky', special: 'ctrl' },
  ],
];

// Flat map: character -> KeyDef (for lookups)
const charMap: Record<string, KeyDef> = {};
for (const row of KEYBOARD_ROWS) {
  for (const k of row) {
    if (!k.special || k.special === 'space') {
      charMap[k.key.toLowerCase()] = k;
    }
  }
}

export function getKeyForChar(char: string): KeyDef | undefined {
  const lower = char.toLowerCase();
  if (lower === ' ') return charMap[' '];
  return charMap[lower];
}

export function getFingerForChar(char: string): FingerId | undefined {
  return getKeyForChar(char)?.finger;
}

// Home row reference keys for resting position guidance
export const HOME_KEYS: Record<FingerId, string> = {
  'L-pinky': 'a',
  'L-ring': 's',
  'L-middle': 'd',
  'L-index': 'f',
  thumb: ' ',
  'R-index': 'j',
  'R-middle': 'k',
  'R-ring': 'l',
  'R-pinky': 'ç',
};
