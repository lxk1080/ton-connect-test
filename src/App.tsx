import "./App.css";
import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react";

function App() {
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
