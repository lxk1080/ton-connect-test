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

// https://t.me/herewalletbot/start?startapp=tonconnect-v__2-id__7615daa0d61a0ddc5d79458c82065e8ea17c60f0740d166ae2f1fa9d43d4db02-r__--7B--22manifestUrl--22--3A--22https--3A--2F--2F127--2E0--2E0--2E1--3A8088--2Ftonconnect--2Dmanifest--2Ejson--22--2C--22items--22--3A--5B--7B--22name--22--3A--22ton--5Faddr--22--7D--5D--7D-ret__back
// https://t.me/herewalletbot/start?startapp=tonconnect-v__2-id__124afb148f8735293dc9c949e836f33ef8a3b1ba5642a3ade2d8e543d9d9b63d-r__--7B--22manifestUrl--22--3A--22https--3A--2F--2Fg6--2Ezone--2Ftonconnect--2Dmanifest--2Ejson--22--2C--22items--22--3A--5B--7B--22name--22--3A--22ton--5Faddr--22--7D--2C--7B--22name--22--3A--22ton--5Fproof--22--2C--22payload--22--3A--22ec54984a1cae9b46000000006bf7884899c451e051926b221e8b1fd225148d83--22--7D--5D--7D-ret__back