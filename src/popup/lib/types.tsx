import { createContext } from 'react'

export const AppStateContext = createContext<{
  pieces: Set<string>
  setPieces: (pieces: Set<string>) => void
  hiddenPieces?: SerializedChessPiece[]
  isActive: boolean
  setIsActive: (isActive: boolean) => void
  delayOnHide: number
  setDelayOnHide: (delayOnHide: number) => void
}>({
  pieces: new Set(),
  setPieces: () => {},
  hiddenPieces: [],
  isActive: false,
  setIsActive: () => {},
  delayOnHide: 300,
  setDelayOnHide: () => {},
})

export type ChessPieceLocation = ChessPiece & {
  originalPosition: HTMLElement
}

export type SavableTypes = Set<string> | object | number | string | boolean
export enum CHESS_PIECE_COLORS {
  WHITE = 'white',
  BLACK = 'black',
}

export enum CHESS_PIECE_NAMES {
  PAWN = 'pawn',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  ROOK = 'rook',
  QUEEN = 'queen',
  KING = 'king',
}

export type SerializedChessPiece = {
  row: number
  column: string
  color: CHESS_PIECE_COLORS | 'ghost'
  pieceName: CHESS_PIECE_NAMES
  originalPosition: any
}

export type ChessPiece = {
  name: CHESS_PIECE_NAMES
  color: CHESS_PIECE_COLORS
}
