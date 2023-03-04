import * as Dialog from '@radix-ui/react-dialog'
import PiecesCheckBoxes from '../Pieces/PiecesCheckBoxes'

const Settings = ({
  pieces,
  setPieces,
}: {
  pieces?: Set<string> | undefined
  setPieces: (pieces: Set<string>) => void
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-800 flex flex-row items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
            />
          </svg>

          <span> Pieces Settings</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0"
          style={{
            zIndex: 3999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded p-8 w-96 overflow-y-scroll max-h-screen"
          style={{
            zIndex: 4000,
          }}
        >
          <div className="absolute top-0 right-0">
            <Dialog.Close asChild>
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
            </Dialog.Close>
          </div>
          {pieces && (
            <>
              <h2 className="text-xl font-bold mb-4">Hidden Pieces Options</h2>
              <PiecesCheckBoxes pieces={pieces} onChange={setPieces} />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Settings
