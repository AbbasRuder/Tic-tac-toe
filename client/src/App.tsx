import { useEffect, useRef, useState } from "react";
import MainGrid from "./components/MainGrid";

type CellState = null | "X" | "O"

const initialCellState: CellState[] = Array(9).fill(null)
function App() {
  const [showCreateGame, setShowCreateGame] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [cells, setCells] = useState<CellState[]>(initialCellState)
  const [turnOfCross, setTurnOfCross] = useState(false);
  const [isTurnOkay, setIsTurnOkay] = useState(true);
  const [result, setResult] = useState(null);

  const gameIdRef = useRef<string | null>(null);
  const clientIdRef = useRef<string | null>(null);
  const wSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if(!wSocketRef.current)
      wSocketRef.current = new WebSocket("ws://localhost:9090");

    wSocketRef.current.onmessage = (message) => {
      // -since we are receiving stringified data from server
      const response = JSON.parse(message.data);

      //first response from the server
      if (response.method === "connect") {
        if (clientIdRef.current === null) {
          clientIdRef.current = response.clientId;
          console.log("client id set successfully - " + clientIdRef.current);
        }
      }

      //receiving response after creating a game
      if (response.method === "create") {
        const { game } = response;
        gameIdRef.current = game.gameId;
        console.log("game created with game state - ", game);
      }

      //receiving response after joining a game
      if (response.method === "join") {
        const { game } = response;
        console.log("joined game with game obj - ", game);
      }

      // receiving response after playing
      if(response.method === "play") {
        const {turnIsOkay, cellsState, result} = response

        setIsTurnOkay(turnIsOkay)
        setCells(cellsState)
        setResult(result)
      }
    };

    wSocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, []);

  const handleCreateGame = () => {
    const payload = {
      method: "create",
      clientId: clientIdRef.current,
    };
    wSocketRef.current?.send(JSON.stringify(payload));

    setTurnOfCross(true)
    setShowCreateGame(false);
  };

  const handleJoinGame = () => {
    if (inputValue.trim() === "") {
      alert("Enter the game id");
      return;
    }

    if (!gameIdRef.current) {
      gameIdRef.current = inputValue;
    }
    console.log("client", clientIdRef.current);
    const payload = {
      method: "join",
      clientId: clientIdRef.current,
      gameId: gameIdRef.current,
    };

    wSocketRef.current?.send(JSON.stringify(payload));

    setTurnOfCross(false)
    setShowCreateGame(false);
    setShowInput(false);
  };

  const sendCellStatePayload = (index: number) => {
    const payload = {
      method: "play",
      gameId: gameIdRef.current,
      clientId: clientIdRef.current,
      index: index
    }

    wSocketRef.current?.send(JSON.stringify(payload))

  }

  return (
    <div className="w-screen h-screen">

      <MainGrid
        isTurnOkay={isTurnOkay}
        cells={cells} 
        setCells={setCells} 
        turnOfCross={turnOfCross}
        sendCellStatePayload={sendCellStatePayload}
        result={result}
      />

      {/* --------- create and join pages */}
      {showCreateGame && (
        <div className="fixed inset-x-0 inset-y-0 bg-slate-300/80 flex flex-col gap-2 justify-center items-center">
          <button
            className="bg-blue-400 w-36 py-2 px-3 rounded text-xl text-white font-semibold"
            onClick={handleCreateGame}
          >
            Create Game
          </button>
          <button
            className="bg-blue-400 w-36 py-2 px-3 rounded text-xl text-white font-semibold"
            onClick={() => setShowInput(true)}
          >
            Join Game
          </button>
        </div>
      )}

      {showInput && (
        <div className="fixed inset-x-0 inset-y-0 bg-slate-300/80 flex flex-col gap-2 justify-center items-center">
          <div className="flex flex-col">
            <label htmlFor="gameId ">Enter Game ID</label>
            <input
              id="gameId"
              className="p-1 border-2 border-black/50 rounded"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="mt-2 bg-blue-400 py-1 px-4 rounded text-lg text-white font-semibold"
              onClick={handleJoinGame}
            >
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

// ----utility code to check for socket errors----
// console.log('readystate? ',wSocketRef.current?.readyState);
// if (wSocketRef.current?.readyState === WebSocket.OPEN) {
//   wSocketRef.current?.send(JSON.stringify(payload));
// } else {
//   console.error("WebSocket is not open");
// }
