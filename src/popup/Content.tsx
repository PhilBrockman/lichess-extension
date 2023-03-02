import { useCallback, useEffect, useState } from 'react'
import PiecesCheckBoxes from './Pieces/PiecesCheckBoxes'
import { SerializedChessPiece } from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'
import { hidePieces } from './lib/hidePieces'
import _ from 'lodash'
import { createObservations, createAnimationEndObservations } from './Popup'

export function Content({
  pieces,
  setPieces,
  activeTab,
  setActiveTab,
}: {
  pieces: string[]
  setPieces: (pieces: string[]) => void

  activeTab: number
  setActiveTab: (index: number) => void
}) {
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()

  console.log('rendering content')
  useEffect(() => {
    console.log('creating observations')
    // const updateHiddenPieces = () => {
    //   const res = hidePieces(pieces)
    //   console.log({ pieces, newHiddenPieces: res })
    //   setHiddenPieces(res)
    // }

    // const creationCallback = (val?: any) => {
    //   console.log({
    //     val,
    //     pieces,
    //     activeTab,
    //   })
    //   updateHiddenPieces()
    // }
    // const obs1 = createObservations(creationCallback)
    // const obs2 = createAnimationEndObservations(() => {
    //   console.count('animation end')
    //   updateHiddenPieces()
    // })
    // console.log('creating observations', { obs1, obs2 })
    // return () => {
    //   // cleanup the observer
    //   obs1.disconnect()
    //   obs2.disconnect()
    // }
  }, [pieces])

  const content = [
    {
      label: 'Settings',
      content: <>{pieces && <PiecesCheckBoxes pieces={pieces} onChange={setPieces} />}</>,
    },
    {
      label: 'Hidden Pieces',
      content: <>{hiddenPieces && <HiddenPieces pieces={hiddenPieces} />}</>,
    },
  ]
  return (
    <>
      <ul className="flex flex-row -mb-px">
        {content.map((tab, index) => {
          const isActive = index === activeTab
          const regularClasses =
            'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer'
          const activeClasses =
            'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'

          return (
            <li
              key={tab.label}
              className={isActive ? activeClasses : regularClasses}
              onClick={() => {
                setActiveTab(index)
              }}
            >
              {tab.label}
            </li>
          )
        })}
      </ul>
      <div className="max-h-96 overflow-y-auto">
        {activeTab !== undefined && content[activeTab]?.content}
      </div>
    </>
  )
}
