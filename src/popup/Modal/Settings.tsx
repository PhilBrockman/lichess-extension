import React from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import PiecesCheckBoxes from '../Pieces/PiecesCheckBoxes'

const Settings = ({
  pieces,
  setPieces,
}: {
  pieces?: string[] | undefined
  setPieces: (pieces: string[]) => void
}) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button>Delete account</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded p-8 w-96 overflow-y-scroll max-h-screen"
          style={{
            zIndex: 1000,
          }}
        >
          <div className="absolute top-0 right-0">
            <AlertDialog.Cancel asChild>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </AlertDialog.Cancel>
          </div>
          {pieces && <PiecesCheckBoxes pieces={pieces} onChange={setPieces} />}{' '}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default Settings
