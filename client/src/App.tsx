import { useEffect } from 'react'
import './App.css'
import MainGrid from './components/MainGrid'

function App() {
  let clientId

  useEffect(() => {
    let ws =  new WebSocket("ws://localhost:9090")

    ws.onmessage = message => {
      // -since we are sending stringified data from server
      const response = JSON.parse(message.data)

      if(response.method === 'connect') {
        clientId = response.clientId
        console.log('client id set successfully - ' + clientId)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [])

  return (
    <div className='w-screen h-screen'>
      <p className='text-center text-xl font-bold'>Tic tac toe</p>
      <MainGrid />
    </div>
  )
}

export default App
