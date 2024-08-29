import './App.css'
import { TonConnectUIProvider, TonConnectButton } from '@tonconnect/ui-react'

function App() {
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://127.0.0.1:8088/tonconnect-manifest.json">
        <span>My App with React UI</span>
        <TonConnectButton />
      </TonConnectUIProvider>
    </>
  )
}

export default App
