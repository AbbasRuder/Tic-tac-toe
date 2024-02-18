import { useEffect, useState } from "react";
import { GiCircleClaws } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";
import WinningMsg from "./WinningMsg";

type CellState = null | "X" | "O";
type Result = {
  type: string,
  message: string
}
type Props = {
  isTurnOkay: boolean
  cells: CellState[];
  setCells: React.Dispatch<React.SetStateAction<CellState[]>>;
  sendCellStatePayload: (index: number) => void
  turnOfCross: boolean
  result: Result | null
};


const initialCellState: CellState[] = Array(9).fill(null);
export default function MainGrid({ isTurnOkay, cells, setCells, turnOfCross, sendCellStatePayload, result }: Props) {

  const [showMsg, setShowMsg] = useState(false);
  const [winningMsg, setWinningMsg] = useState("");

  const handleClick = (index: number) => {
    // -checks null so that fn runs only once for each cell
    if (cells[index] === null && isTurnOkay) {
      const newCells = cells.map((cell, i) => {
        if (i === index) {
          return turnOfCross ? "X" : "O";
        }
        return cell;
      });

      sendCellStatePayload(index)
      setCells(newCells);
    }

    if(!isTurnOkay) {
      console.log("It is not your turn")
    }
  };

  const handleGameRestart = () => {
    setCells(initialCellState);
    // setTurnOfCross(false);
    setWinningMsg("");
    setShowMsg(false);
  };

  const renderMark = (cell: CellState) => {
    if (cell !== null) {
      return cell === "X" ? (
        <GiCrossMark className="w-16 h-16" />
      ) : (
        <GiCircleClaws className="w-16 h-16" />
      );
    }
  };

  useEffect(() => {
    if (result?.type === "WINNER") {
      setShowMsg(true);
      setWinningMsg(result.message);
    } else if (result?.type === "DRAW") {
      setShowMsg(true);
      setWinningMsg(result.message);
    }
  }, [result])

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
          );
        })}
      </div>

      {showMsg && (
        <div className="h-full fixed inset-x-0 inset-y-0 bg-slate-600/50">
          <WinningMsg
            winningMsg={winningMsg}
            handleGameRestart={handleGameRestart}
          />
        </div>
      )}
    </>
  );
}
