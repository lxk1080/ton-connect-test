import { useEffect, useState } from "react";
import "./App.css";
import {
  createPayloadByTonCoreCell,
  createJettonTransferPayload,
  createPayloadByTonWebCell,
  getUserTokenWalletAddress,
} from './utils';
import {
  TonConnectUIProvider,
  TonConnectButton,
  useIsConnectionRestored,
  useTonWallet,
  useTonConnectUI,
  useTonAddress,
} from "@tonconnect/ui-react";
// import { StargateClient } from '@cosmjs/stargate'

function App() {
  useEffect(() => {
    test()
  }, [])

  const test = async () => {
    // const client = await StargateClient.connect('https://cosmos-rpc.quickapi.com:443')
    // const client = await StargateClient.connect('http://localhost:8089/cosmosRpc')
    // console.log(1234, client)
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
        <SendButton />
      </TonConnectUIProvider>
    </>
  );
}

const Button = () => {
  const [tonConnectUI] = useTonConnectUI();
  const Wallet = useTonWallet()
  const status = useIsConnectionRestored()
  const userFriendlyAddress = useTonAddress()
  const rawAddress = useTonAddress(false)

  console.log('status', status)
  console.log('Wallet', Wallet)
  console.log('userFriendlyAddress', userFriendlyAddress)
  console.log('rawAddress', rawAddress)

  tonConnectUI.setConnectRequestParameters({ state: "loading" })

  tonConnectUI.setConnectRequestParameters({
    state: 'ready',
    value: {
      tonProof: "eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiNWU3NzFkMzA2ZDNlMWY5ODk2Zjg0MDRmMzdkMTFmMDNjMzQzMjAzYzdmZjBjMDk1OWJmMzQ3ZDkyMGNmZDczYyIsImlhdCI6MTczMjI1NDc5OSwiZXhwIjoxNzMyMjU1Njk5fQ.dQvErnMZ61I2VWlpkgXkMoQ04_b-Nm745I6jSU7ruK8",
    },
  })

  return <TonConnectButton />
}

const storeKey = '__messages_data__'
const storeString = localStorage.getItem(storeKey)
const storeData = storeString ? JSON.parse(storeString) : null

const generateKeyId = () => {
  return Math.random().toString().slice(2)
}

const payloadTypes = [
  { value: '0', text: 'TonCoreCell', createPayload: createPayloadByTonCoreCell },
  { value: '1', text: 'JettonTransfer', createPayload: createJettonTransferPayload },
  { value: '2', text: 'TonWebCell', createPayload: createPayloadByTonWebCell },
]

const tonTxData = {
  address: '',
  amount: 0,
}

const contractTxData = {
  tonAddress: '',
  contractAddress: '',
  amount: 0,
  feeAmount: 0.05, // 50000000，Ton 手续费，超额的返回，默认给个 0.05
}

const initTxList = storeData || [
  {
    id: generateKeyId(),
    address: 'UQCU-Q_iHDRPdvKPdaIKFXRuAEFJcjcRY5aRUW3H0AAl6OO6',
    amount: 0.001,
  },
  {
    id: generateKeyId(),
    address: 'UQBkBVZpW5-wc4TwhDiNkZUa3uEJMW3WnDhGqtZpNprD_Asy',
    amount: 0.001,
  },
  {
    id: generateKeyId(),
    tonAddress: 'UQCU-Q_iHDRPdvKPdaIKFXRuAEFJcjcRY5aRUW3H0AAl6OO6',
    contractAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
    amount: 0.5,
    feeAmount: 0.05,
  }
]

const SendButton = () => {
  const [tonConnectUI] = useTonConnectUI()
  const userFriendlyAddress = useTonAddress()
  const [payloadType, setPayloadType] = useState(payloadTypes[0].value)
  const [txList, setTxList] = useState<any[]>(initTxList)

  // const initData = async () => {
  //   // 生成 payload 数据
  //   const payload = await createPayloadByTonCoreCell(
  //     1000000, // USDT 1
  //     'UQCU-Q_iHDRPdvKPdaIKFXRuAEFJcjcRY5aRUW3H0AAl6OO6' // 目标 Ton 地址
  //   )
  //   // 生成 JettonWallet 地址
  //   const tokenAddress = await getUserTokenWalletAddress(
  //     userFriendlyAddress, // 发送方的 Ton 地址
  //     'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs' // USDT 合约地址
  //   )
  //   const data = {
  //     payload,
  //     tokenAddress,
  //   }
  //   // @ts-ignore
  //   console.log('data ==>', window.initData = data)
  //   // payload: "te6cckEBAQEAVgAAqA+KfqUAAAAAAAAAACJxCAEp8h/EOGie7eUe60QUKujcAIKS5G4ixy0iotuPoABL0QAlPkP4hw0T3byj3WiChV0bgBBSXI3EWOWkVFtx9AAJegQH0JzkrGI="
  //   // tokenAddress: "0:98de1e33abcf2170c422777f356bb539861fceed61f8b5deabebb550667d34a0"
  //   return data
  // }

  const toMinimumUnitAmount = (amount: string, address: string) => {
    const isUsdt = address === 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'
    return isUsdt ? +amount * 1e6 : +amount * 1e9
  }

  const onSendClick = async () => {
    const data = JSON.parse(JSON.stringify(txList))
    console.log('txList ==>', JSON.parse(JSON.stringify(data)))

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      delete item.id
      item.amount = toMinimumUnitAmount(item.amount, item.address || item.contractAddress)
      console.log('amount ==>', item.amount)
      if (item.contractAddress) {
        const payloadItem = payloadTypes.find((item) => item.value === payloadType) as any
        console.log('payloadType ==>', payloadItem.text)
        item.payload = await payloadItem.createPayload(item.amount, item.tonAddress)
        // 为了本地浏览器调试，给个默认值
        const userAddress = userFriendlyAddress || 'UQAv_UweuQ1D7yO1YJraX-wWIuJlHAho1eSlPU8Sk8cflZCh'
        item.address = await getUserTokenWalletAddress(userAddress, item.contractAddress)
        item.amount = item.feeAmount * 1e9 // Ton 手续费，超额的返回
        delete item.tonAddress
        delete item.contractAddress
        delete item.feeAmount
      }
      // 转化为字符串
      item.amount += ''
    }

    console.log('messages ==>', data)

    const transaction = {
      messages: data,
      validUntil: Math.floor(Date.now() / 1000) + 60,
    }

    // TAC TEST
    // const transaction = {
    //   messages: [{
    //     address: 'EQCtedmVBAGBPm-OE2vCuTOPoUb2y586hw9cXJbY2eWt0Isn',
    //     amount: '450000000',
    //     payload: 'te6cckECAwEAATUAAWxsWCBZAAAAAGeppeNK1nzTQF9eEAgA5hbpKQhbNTYF/aI32efajICLJpBBd7zrNyHaa4sLZ5UBAf57ImV2bV9jYWxsIjp7InRhcmdldCI6IjB4RkY0NjNlOUU5QjhmMzVEMTBGNDgzMzU3OTljYkI1MDVEMTcwM0EwYiIsIm1ldGhvZF9uYW1lIjoibWludChieXRlcyxieXRlcykiLCJhcmd1bWVudHMiOiJBQUFBQUFBQUFBQUFBAgDwQUFBLzBZK25wdVBOZEVQU0ROWG1jdTFCZEZ3T2dzQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJmWGhBQT09In0sInNoYXJkZWRfaWQiOiIxNzM5MTcxNzQyIiwic2hhcmRfY291bnQiOjF9mDqNyA==',
    //   }],
    //   validUntil: Math.floor(Date.now() / 1000) + 60,
    // }

    console.log('transaction ==>', transaction)
    const res = await tonConnectUI.sendTransaction(transaction)
    console.log('sendRes ==>', res)
  }

  const addTx = (isContract: boolean) => {
    if (isContract) {
      setTxList([...txList, { id: generateKeyId(), ...contractTxData }])
    } else {
      setTxList([...txList, { id: generateKeyId(), ...tonTxData }])
    }
  }

  const clearTx = () => {
    setTxList([])
  }

  const deleteTx = (id: string) => {
    setTxList(txList.filter((n) => n.id !== id))
  }

  const onValueChange = (id: string, field: string, value: string) => {
    const itemIndex = txList.findIndex((n) => n.id === id)
    const newTxList = [...txList]
    newTxList[itemIndex][field] = value
    setTxList(newTxList)
  }

  const storeData = () => {
    localStorage.setItem(storeKey, JSON.stringify(txList))
    alert('已保存！')
  }

  const clearData = () => {
    localStorage.removeItem(storeKey)
    alert('已清除！')
  }

  const onPayloadTypeChange = (value: string) => {
    setPayloadType(value)
  }

  const gotoDownloadApp = () => {
    const galink = (() => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      const isSamsung = /samsung/.test(userAgent)
      const isMac = /macintosh|mac os x/.test(userAgent)
      const isWindows = /windows/.test(userAgent)
      const appleUrl =
        'https://apps.apple.com/app/google-authenticator/id388497605'
      const googleUrl =
        'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'
      // Microsoft Authenticator（三星应用商店没有谷歌验证器）
      const galaxyUrl =
        'https://galaxystore.samsung.com/detail/com.azure.authenticator'
      if (isIOS || isMac) return appleUrl
      if (isSamsung) return googleUrl
      if (isAndroid || isWindows) return googleUrl
      return googleUrl
    })()
    const isInTg = location.hash.slice(1).split('=')[0] === 'tgWebAppData'
    if (isInTg) {
      // @ts-ignore
      window.Telegram.WebApp.openLink(galink)
    } else {
      window.open(galink, '_blank')
    }
  }

  return (
    <div className="send-btn-container">
      <div className="select-box">
        <span>生成 payload 的方式：</span>
        <select value={payloadType} onChange={(e) => onPayloadTypeChange(e.target.value)}>
          {payloadTypes.map((item) => (
            <option key={item.value} value={item.value}>{item.text}</option>
          ))}
        </select>
      </div>
      {txList.map((txItem) => {
        const isContract = Object.keys(txItem).includes('contractAddress')
        if (isContract) {
          return (
            <div className="tx-item" key={txItem.id}>
              <strong>Contract</strong>
              <span className="delete" onClick={() => deleteTx(txItem.id)}>✕</span>
              <div>
                <span>tonAddress: </span>
                <input
                  type="text"
                  value={txItem.tonAddress}
                  onChange={(e) => onValueChange(txItem.id, 'tonAddress', e.target.value)}
                />
              </div>
              <div>
                <span>contractAddress: </span>
                <input
                  type="text"
                  value={txItem.contractAddress}
                  onChange={(e) => onValueChange(txItem.id, 'contractAddress', e.target.value)}
                />
              </div>
              <div>
                <span>amount: </span>
                <input
                  type="number"
                  value={txItem.amount}
                  onChange={(e) => onValueChange(txItem.id, 'amount', e.target.value)}
                />
              </div>
              <div>
                <span>feeAmount: </span>
                <input
                  type="number"
                  value={txItem.feeAmount}
                  onChange={(e) => onValueChange(txItem.id, 'feeAmount', e.target.value)}
                />
              </div>
            </div>
          )
        } else {
          return (
            <div className="tx-item" key={txItem.id}>
              <strong>Ton</strong>
              <span className="delete" onClick={() => deleteTx(txItem.id)}>✕</span>
              <div>
                <span>address: </span>
                <input
                  type="text"
                  value={txItem.address}
                  onChange={(e) => onValueChange(txItem.id, 'address', e.target.value)}
                />
              </div>
              <div>
                <span>amount: </span>
                <input
                  type="number"
                  value={txItem.amount}
                  onChange={(e) => onValueChange(txItem.id, 'amount', e.target.value)}
                />
              </div>
            </div>
          )
        }
      })}
      <div className="btn-group">
        <button onClick={() => addTx(false)}>添加Ton交易</button>
        <button onClick={() => addTx(true)}>添加合约交易</button>
        <button onClick={clearTx}>清空交易数据</button>
        <button onClick={storeData}>将当前数据保存到storage</button>
        <button onClick={clearData}>清除storage</button>
      </div>
      <button className="btnSend" onClick={onSendClick}>
        Send transaction
      </button>

      {/* others */}
      <div style={{ marginTop: '20px', color: 'blue', cursor: 'pointer' }}>
        <span onClick={gotoDownloadApp}>
          跳转到 GAuth 下载页
        </span>
      </div>
    </div>
  )
}

export default App
