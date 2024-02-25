import { useState } from 'react'

function App() {
  window.addEventListener('online', window.context.reconnect)
  const [first, setfirst] = useState(null)
  return (
    <div className="flex h-full items-center justify-center">
      <button onClick={() => window.context.test()}>Test</button>
      <button onClick={() => window.context.reconnect().catch((e) => setfirst(e.message))}>
        reconnect
      </button>
      <br />
      <button onClick={() => window.context.addDog()}>Add Dog</button>
      <br />
      <div className="text-4xl text-blue-500">{first}</div>
    </div>
  )
}

export default App
