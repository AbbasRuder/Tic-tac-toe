import { useState } from "react"
import { GiCircleClaws } from "react-icons/gi"
import { GiCrossMark } from "react-icons/gi"
import WinningMsg from "./WinningMsg"

type cellState = null | "X" | "O"

const WINNING_COMBINATION = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]
const initialCellState: cellState[] = Array(9).fill(null)

export default function MainGrid() {
  const [cells, setCells] = useState<cellState[]>(initialCellState)
  const [turnOfCross, setTurnOfCross] = useState(false)
  const [showMsg, setShowMsg] = useState(false)
  const [winningMsg, setWinningMsg] = useState('')


  const handleClick = (index: number) => {
    // -checks null so that fn runs only once for each cell
    if (cells[index] === null) {
      const newCells = cells.map((cell, i) => {
        if (i === index) {
          return turnOfCross ? "X" : "O"
        }
        return cell
      })

      setCells(newCells)

      if (checkWinner(newCells)) {
        setShowMsg(true)
        setWinningMsg(`${turnOfCross ? 'X' : 'O'} Wins !!`)
      } else if (checkDraw(newCells)) {
        setShowMsg(true)
        setWinningMsg("Match Draw !!")
      } else {
        setTurnOfCross((crntTurn) => !crntTurn)
      }
    }
  }

  const checkWinner = (newCells: cellState[]) => {
    return WINNING_COMBINATION.some((combination) => {
      const [a, b, c] = combination
      return (
        newCells[a] !== null &&
        newCells[a] === newCells[b] &&
        newCells[a] === newCells[c]
      )
    })
  }

  const checkDraw = (newCells: cellState[]) => {
    return [...newCells].every((cell) => {
      return cell === "X" || cell === "O"
    })
  }

  const handleGameRestart = () => {
    setCells(initialCellState)
    setTurnOfCross(false)
    setWinningMsg('')
    setShowMsg(false)
  }

  const renderMark = (cell: cellState) => {
    if (cell !== null) {
      return cell === "X" ? (
        <GiCrossMark className="w-16 h-16" />
      ) : (
        <GiCircleClaws className="w-16 h-16" />
      )
    }
  }

  return (
    <>
      <div
        className="w-full h-full grid justify-center items-center content-center justify-items-center gap-2"
        style={{ gridTemplateColumns: "repeat(3,auto)" }}
      >
        {cells.map((cell, index) => {
          return (
            <div
              className="w-[100px] h-[100px] flex justify-center items-center bg-slate-200"
              onClick={() => handleClick(index)}
              key={index}
            >
              {renderMark(cell)}
            </div>
          )
        })}
      </div>

      {showMsg && (
        <div className="h-full fixed inset-x-0 inset-y-0 bg-slate-600/50">
          <WinningMsg winningMsg={winningMsg} handleGameRestart={handleGameRestart}/>
        </div>
      )}
    </>
  )
}
