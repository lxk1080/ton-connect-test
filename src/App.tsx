import { useEffect } from "react";
import "./App.css";
import {
  TonConnectUIProvider,
  TonConnectButton,
  useIsConnectionRestored,
  useTonWallet,
  useTonConnectUI,
} from "@tonconnect/ui-react";

const Button = () => {
  const Wallet = useTonWallet()
  const status = useIsConnectionRestored()
  // const [tonConnectUI] = useTonConnectUI()

  // const close = async () => {
  //   await tonConnectUI.disconnect()
  // }

  useEffect(() => {
    // close()
  }, [])

  console.log('status', status)
  console.log('Wallet', Wallet)

  return <TonConnectButton />
}

const SendButton = () => {
  const [tonConnectUI] = useTonConnectUI()

  const onSendClick = () => {
    const transaction = {
      messages: [
          {
              // address: "0:94f90fe21c344f76f28f75a20a15746e004149723711639691516dc7d00025e8", // destination address
              address: "UQCU-Q_iHDRPdvKPdaIKFXRuAEFJcjcRY5aRUW3H0AAl6OO6",
              amount: "1000000" // Toncoin in nanotons - 0.001 Ton
              // amount: "20000000000000"
          }
      ],
      validUntil: Math.floor(Date.now() / 1000) + 60,
    }

    tonConnectUI.sendTransaction(transaction)
  }

  return (
    <button onClick={onSendClick}>
      Send transaction
    </button>
  )
}

function App() {
  return (
    <>
      <TonConnectUIProvider
        manifestUrl="https://ton-connect-test.vercel.app/tonconnect-manifest.json"
        actionsConfiguration={{
          twaReturnUrl: "https://t.me/zerolxktontestBot/tgWalletTonConnect",
        }}
      >
        <span>My App with React UI</span>
        <Button />
        <SendButton />
      </TonConnectUIProvider>
    </>
  );
}

export default App
