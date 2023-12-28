import { useEffect, useRef, useState } from "react";
import "./App.css";
import MainGrid from "./components/MainGrid";

function App() {
  const [showCreateGame, setShowCreateGame] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // let clientId: string;
  let gameId: string | null = null;

  const clientIdRef = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:9090");

    wsRef.current.onmessage = (message) => {
      // -since we are receiving stringified data from server
      const response = JSON.parse(message.data);

      //first response from the server
      if (response.method === "connect") {
        clientIdRef.current = response.clientId;
        console.log("client id set successfully - " + clientIdRef.current);
      }

      //receiving response after creating a game
      if (response.method === "create") {
        const { game } = response;
        gameId = game.gameId;
        console.log("game created with game state - ", game);
      }

      //receiving response after joining a game
      if (response.method === "join") {
        const { game } = response;
        console.log('joined game with game obj - ', game)
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, []);

  const handleCreateGame = () => {
    const payload = {
      method: "create",
      clientId: clientIdRef.current,
    };
    wsRef.current?.send(JSON.stringify(payload));
    setShowCreateGame(false);
  };

  const handleJoinGame = () => {
    if (inputValue.trim() === "") {
      alert("Enter the game id");
      return;
    }

    if (!gameId) {
      gameId = inputValue;
    }
    console.log("client", clientIdRef.current);
    const payload = {
      method: "join",
      clientId: clientIdRef.current,
      gameId: gameId,
    };

    // console.log('readystate? ',wsRef.current?.readyState);
    // if (wsRef.current?.readyState === WebSocket.OPEN) {
    //   wsRef.current?.send(JSON.stringify(payload));
    // } else {
    //   console.error("WebSocket is not open");
    // }

    wsRef.current?.send(JSON.stringify(payload));
    setShowCreateGame(false);
    setShowInput(false);
  };

  return (
    <div className="w-screen h-screen">
      {/* <p className='text-center text-xl font-bold'>Tic tac toe</p> */}
      <MainGrid />

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
