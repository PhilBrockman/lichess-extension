export const chessPieceNames = {
  pawn: true,
  knight: true,
  bishop: true,
  rook: true,
  queen: true,
  king: true,
} as const

export const chessPieceColors = {
  white: true,
  black: true,
} as const

export const allCombinationsOfChessPieces = () => {
  const allCombinations: ChessPiece[] = []
  for (const pieceName of Object.keys(chessPieceNames)) {
    for (const pieceColor of Object.keys(chessPieceColors)) {
      allCombinations.push({
        name: pieceName as ChessPieceName,
        color: pieceColor as ChessPieceColor,
      })
    }
  }
  return new Set(allCombinations.map(stringifyChessPieceIdentifier))
}

export type ChessPieceName = keyof typeof chessPieceNames
export type ChessPieceColor = keyof typeof chessPieceColors

export type SerializedChessPiece = {
  row: number
  column: string
  color: string
  pieceName: string
  originalPosition: any
}

export type ChessPiece = {
  name: ChessPieceName
  color: ChessPieceColor
}

export const isValidColor = (color: string): color is ChessPieceColor => {
  return chessPieceColors[color as ChessPieceColor] !== undefined
}

export const isValidName = (name: string): name is ChessPieceName => {
  return chessPieceNames[name as ChessPieceName] !== undefined
}

export const stringifyChessPieceIdentifier = (piece: ChessPiece) => {
  return `${piece.color}_${piece.name}`
}

export const parseChessPieceIdentifier = (piece: string): ChessPiece => {
  const [color, name] = piece.split('_') as [ChessPieceColor, ChessPieceName]
  return {
    color,
    name,
  }
}

export type ChessPieceLocation = ChessPiece & {
  originalPosition: HTMLElement
}
