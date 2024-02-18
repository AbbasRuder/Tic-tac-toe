
interface Props {
  winningMsg: string,
  handleGameRestart: () => void
}

export default function WinningMsg({ winningMsg, handleGameRestart }: Props) {
  return (
    <div className="h-full flex flex-col gap-2 justify-center items-center">
      <p className="text-slate-100 text-xl font-bold sm:text-4xl">{winningMsg}</p>
      <button 
        className="bg-gray-300 py-2 px-3 rounded font-semibold sm:text-xl"
        onClick={handleGameRestart}
      >
        Restart
      </button>
      <p className="text-white">Refresh the page to begin again</p>
    </div>
  )
}
