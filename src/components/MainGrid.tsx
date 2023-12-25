import { useState } from "react"
import { GiCircleClaws } from "react-icons/gi"
import { GiCrossMark } from "react-icons/gi"

type cellState = null | "X" | "O"

const initialCellState: cellState[] = Array(9).fill(null)
export default function MainGrid() {
  const [cells, setCells] = useState<cellState[]>(initialCellState)
  const [turnOfCross, setTurnOfCross] = useState(false)

  const handleClick = (index: number) => {
    if (cells[index] === null) {
      setCells((crntCells) =>
        crntCells.map((cell, i) => {
          if (i === index) {
            return turnOfCross ? "X" : "O"
          }
          return cell
        })
      )

      setTurnOfCross((crntTurn) => !crntTurn)
    }
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
    </>
  )
}
