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

  console.log('status', status)
  console.log('Wallet', Wallet)

  return <TonConnectButton />
}

const SendButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const transaction = {
    messages: [
        {
            address: "0:94f90fe21c344f76f28f75a20a15746e004149723711639691516dc7d00025e8", // destination address
            amount: "2000000" // Toncoin in nanotons
        }
    ],
    validUntil: 10000,
  }
  return (
    <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
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

export default App;
