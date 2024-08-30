import "./App.css";
import {
  TonConnectUIProvider,
  TonConnectButton,
  useIsConnectionRestored,
  useTonWallet,
} from "@tonconnect/ui-react";

function App() {
  const Wallet = useTonWallet();
  const status = useIsConnectionRestored()


  console.log('status', status)

  console.log('Wallet', Wallet)

  return (
    <>
      <TonConnectUIProvider
        manifestUrl="https://ton-connect-test.vercel.app/tonconnect-manifest.json"
        actionsConfiguration={{
          twaReturnUrl: "https://t.me/tomowalletbot/tomo_wallet_app",
        }}
      >
        <span>My App with React UI</span>
        <TonConnectButton />
      </TonConnectUIProvider>
    </>
  );
}

export default App;
