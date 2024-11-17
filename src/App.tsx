import { useEffect } from "react";
import "./App.css";
import { createPayloadByTonCoreCell, getUserTokenWalletAddress } from './utils';
import {
  TonConnectUIProvider,
  TonConnectButton,
  useIsConnectionRestored,
  useTonWallet,
  useTonConnectUI,
  useTonAddress,
} from "@tonconnect/ui-react";

const Button = () => {
  const Wallet = useTonWallet()
  const status = useIsConnectionRestored()
  const userFriendlyAddress = useTonAddress()
  const rawAddress = useTonAddress(false)

  console.log('status', status)
  console.log('Wallet', Wallet)
  console.log('userFriendlyAddress', userFriendlyAddress)
  console.log('rawAddress', rawAddress)

  return <TonConnectButton />
}

const SendButton = () => {
  const [tonConnectUI] = useTonConnectUI()
  const userFriendlyAddress = useTonAddress()

  useEffect(() => {
    // initData()
  }, [])

  const initData = async () => {
    // 生成 payload 数据
    const payload = await createPayloadByTonCoreCell(
      10000, // USDT 0.01
      'UQCU-Q_iHDRPdvKPdaIKFXRuAEFJcjcRY5aRUW3H0AAl6OO6' // 目标 Ton 地址
    )
    // 生成 JettonWallet 地址
    const tokenAddress = await getUserTokenWalletAddress(
      userFriendlyAddress, // 发送方的 Ton 地址
      'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs' // USDT 合约地址
    )
    const data = {
      payload,
      tokenAddress,
    }
    // @ts-ignore
    console.log('data ==>', window.initData = data)
    // payload: "te6cckEBAQEAVgAAqA+KfqUAAAAAAAAAACJxCAEp8h/EOGie7eUe60QUKujcAIKS5G4ixy0iotuPoABL0QAlPkP4hw0T3byj3WiChV0bgBBSXI3EWOWkVFtx9AAJegQH0JzkrGI="
    // tokenAddress: "0:98de1e33abcf2170c422777f356bb539861fceed61f8b5deabebb550667d34a0"
    return data
  }

  const onSendClick = async () => {
    const data = await initData()
    const transaction = {
      messages: [
          {
              // address: "0:94f90fe21c344f76f28f75a20a15746e004149723711639691516dc7d00025e8", // destination address
              address: "UQCU-Q_iHDRPdvKPdaIKFXRuAEFJcjcRY5aRUW3H0AAl6OO6",
              amount: "1000000" // Toncoin in nanotons - 0.001 Ton
              // amount: "20000000000000"
          },
          {
            address: "UQBkBVZpW5-wc4TwhDiNkZUa3uEJMW3WnDhGqtZpNprD_Asy",
            amount: "1000000" // 0.001 Ton
          },
          {
            address: data.tokenAddress,
            amount: "0",
            payload: data.payload,
          }
      ],
      validUntil: Math.floor(Date.now() / 1000) + 60,
    }

    const res = await tonConnectUI.sendTransaction(transaction)
    console.log('sendRes ==>', res)
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
