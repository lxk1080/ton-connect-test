import "./App.css";
import {
  TonConnectUIProvider,
  TonConnectButton,
  useIsConnectionRestored,
  useTonWallet,
} from "@tonconnect/ui-react";

const Button = () => {
  const Wallet = useTonWallet()
  const status = useIsConnectionRestored()

  console.log('status', status)
  console.log('Wallet', Wallet)

  return <TonConnectButton />
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
      </TonConnectUIProvider>
    </>
  );
}

export default App;
