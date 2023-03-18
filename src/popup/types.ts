export type SavableTypes = Set<string> | object | number | string | boolean

export const chessPieceNames = {
  pawn: true,
  knight: true,
  bishop: true,
  rook: true,
  queen: true,
  king: true,
} as const

export enum CHESS_PIECE_COLORS {
  WHITE = 'white',
  BLACK = 'black',
}

export const chessPieceColors = {
  [CHESS_PIECE_COLORS.WHITE]: true,
  [CHESS_PIECE_COLORS.BLACK]: true,
} as const

export const allCombinationsOfChessPieces = () => {
  const allCombinations: ChessPiece[] = []
  for (const pieceName of Object.keys(chessPieceNames)) {
    for (const pieceColor of Object.keys(chessPieceColors)) {
      allCombinations.push({
        name: pieceName as ChessPieceName,
        color: pieceColor as CHESS_PIECE_COLORS,
      })
    }
  }
  return new Set(allCombinations.map(stringifyChessPieceIdentifier))
}

export type ChessPieceName = keyof typeof chessPieceNames

export type SerializedChessPiece = {
  row: number
  column: string
  color: string
  pieceName: string
  originalPosition: any
}

export type ChessPiece = {
  name: ChessPieceName
  color: CHESS_PIECE_COLORS
}

export const isValidColor = (color: string): color is CHESS_PIECE_COLORS => {
  return chessPieceColors[color as CHESS_PIECE_COLORS] !== undefined
}

export const isValidName = (name: string): name is ChessPieceName => {
  return chessPieceNames[name as ChessPieceName] !== undefined
}

export const stringifyChessPieceIdentifier = (piece: ChessPiece) => {
  return `${piece.color}_${piece.name}`
}

export const parseChessPieceIdentifier = (piece: string): ChessPiece => {
  const [color, name] = piece.split('_') as [CHESS_PIECE_COLORS, ChessPieceName]
  return {
    color,
    name,
  }
}

export type ChessPieceLocation = ChessPiece & {
  originalPosition: HTMLElement
}
