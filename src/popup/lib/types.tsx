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

export type SavableTypes = Set<string> | object | number | string | boolean

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

export type ChessPieceLocation = ChessPiece & {
  originalPosition: HTMLElement
}
