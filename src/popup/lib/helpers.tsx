import { CHESS_PIECE_COLORS, CHESS_PIECE_NAMES, ChessPiece } from './types'

export const allCombinationsOfChessPieces = () => {
  const allCombinations: ChessPiece[] = []
  for (const pieceName of Object.values(CHESS_PIECE_NAMES)) {
    for (const pieceColor of Object.values(CHESS_PIECE_COLORS)) {
      allCombinations.push({
        name: pieceName,
        color: pieceColor,
      })
    }
  }
  return new Set(allCombinations.map(stringifyChessPieceIdentifier))
}

export const isValidColor = (color: string): color is CHESS_PIECE_COLORS => {
  return Object.values(CHESS_PIECE_COLORS).includes(color as CHESS_PIECE_COLORS)
}

export const isValidName = (name: string): name is CHESS_PIECE_NAMES => {
  return Object.values(CHESS_PIECE_NAMES).includes(name as CHESS_PIECE_NAMES)
}

export const stringifyChessPieceIdentifier = (piece: ChessPiece) => {
  return `${piece.color}_${piece.name}`
}

export const parseChessPieceIdentifier = (piece: string): ChessPiece => {
  const [color, name] = piece.split('_') as [CHESS_PIECE_COLORS, CHESS_PIECE_NAMES]
  return {
    color,
    name,
  }
}
