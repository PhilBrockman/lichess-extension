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
    <AlertDialog.Root open={true}>
      <AlertDialog.Trigger asChild>
        <button className="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
            />
          </svg>
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="fixed inset-0"
          style={{
            zIndex: 3999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
        <AlertDialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded p-8 w-96 overflow-y-scroll max-h-screen"
          style={{
            zIndex: 4000,
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
          {pieces && (
            <>
              <h2 className="text-xl font-bold mb-4">Options</h2>
              <PiecesCheckBoxes pieces={pieces} onChange={setPieces} />
            </>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default Settings
