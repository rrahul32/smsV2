function App() {
  return (
    <div className="flex h-full items-center justify-center">
      <button onClick={() => window.context.test()}>Test</button>
      <div className="text-4xl text-blue-500">Hello</div>
    </div>
  )
}

export default App
