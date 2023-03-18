import {
  ChessPiece,
  chessPieceNames,
  chessPieceColors,
  ChessPieceName,
  ChessPieceColor,
} from './types'

export function allCombinationsOfChessPieces() {
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
