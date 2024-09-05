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

function App() {
  const [tonConnectUI] = useTonConnectUI();

  const transaction = {
    messages: [
        {
            address: "0:cd60b11355dbc5ded0d14e245fef1ba3014154ef077959e8102e10656d6ea02c", // destination address
            amount: "20000000" //Toncoin in nanotons
        }
    ],
    validUntil: 10000,
  }

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
      </TonConnectUIProvider>
      <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
          Send transaction
      </button>
    </>
  );
}

export default App;
