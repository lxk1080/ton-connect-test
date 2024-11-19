import TonWeb from 'tonweb'
import { Address } from '@ton/core'
import { beginCell, toNano, TonClient } from '@ton/ton'

export const createPayloadByTonCoreCell = async (
  tokenAmount: number,
  recipientAddress: string
) => {
  const destinationAddress = Address.parse(recipientAddress)

  const body = beginCell()
      .storeUint(0xf8a7ea5, 32) // jetton 转账操作码
      .storeUint(0, 64) // query_id:uint64
      .storeCoins(tokenAmount) // amount:(VarUInteger 16) -  转账的 Jetton 金额（小数位 = 6 - jUSDT, 9 - 默认）
      .storeAddress(destinationAddress) // destination:MsgAddress
      .storeAddress(destinationAddress) // response_destination:MsgAddress
      .storeBit(false)
      .storeCoins(toNano('0.000001'))
      .storeBit(false)
      .endCell();

  return body.toBoc().toString('base64')
}

export const createJettonTransferPayload = async (tokenAmount: number, recipientAddress: string) => {
  const tonWeb = new TonWeb(new TonWeb.HttpProvider());
  const jettonWallet = new TonWeb.token.jetton.JettonWallet(
    tonWeb.provider,
    {}
  );
  const transferBody = await jettonWallet.createTransferBody({
    queryId: 0,
    // @ts-ignore
    jettonAmount: tokenAmount,
    toAddress: new TonWeb.utils.Address(recipientAddress),
    // forwardPayload: comment,
    forwardAmount: TonWeb.utils.toNano('0.0001'),
    responseAddress: new TonWeb.utils.Address(recipientAddress),
  });
  const uint8 = await transferBody.toBoc();
  return Buffer.from(uint8).toString('hex');
};

export const createPayloadByTonWebCell = async (tokenAmount: number, recipientAddress: string) => {
  const tonWeb = new TonWeb(new TonWeb.HttpProvider());
  const cell = new tonWeb.boc.Cell();

  cell.bits.writeUint(0xf8a7ea5, 32); // Operation code for transferring tokens
  cell.bits.writeUint(0, 64); // Query ID (can be any unique identifier)
  cell.bits.writeCoins(tokenAmount); // Amount of NOT tokens to send
  cell.bits.writeAddress(new TonWeb.utils.Address(recipientAddress)); // recipient address
  cell.bits.writeAddress(new TonWeb.utils.Address(recipientAddress)); // response address
  cell.bits.writeBit(false); // null custom_payload
  cell.bits.writeCoins(TonWeb.utils.toNano('0.0001')); // forwardAmount
  cell.bits.writeBit(false); // empty forward payload

  return Buffer.from(await cell.toBoc()).toString('hex');
};

// const getJettonPayload = async ({
//   publicKey,
//   jettonMasterAddress,
//   jettonAmount,
//   fee,
// }) => {
//   const tonWeb = TonWeb
//   const WalletClass = tonWeb.wallet.all["v4R2"];
//   const wallet = new WalletClass(tonWeb.provider, {
//     publicKey: publicKey,
//     wc: 0,
//   });
//   const seqno = (await wallet.methods.seqno().call()) || 0;
//   const walletAddress = await wallet.getAddress();
//   const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonWeb.provider, {
//     address: jettonMasterAddress,
//   });
//   // console.log((await jettonMinter.getJettonData()).totalSupply);
//   const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
//     walletAddress
//   );
//   const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonWeb.provider, {
//     address: jettonWalletAddress.toString(true, true, false),
//   });
//   const transferBody = await jettonWallet.createTransferBody({
//     queryId: seqno,
//     // @ts-ignore
//     jettonAmount,
//     toAddress: new TonWeb.utils.Address(
//       "0QAtLidZyCHnqsqPqaaFdXYhmAp_i0OkKfiumJdWBOoR_ohX"
//     ),
//     forwardAmount: fee,
//     responseAddress: walletAddress,
//   });
//   return transferBody;
// };

export async function getUserTokenWalletAddress(
  userAddress: string,
  jettonMasterAddress: string
) {
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
  })
  const userAddressCell = beginCell()
    .storeAddress(Address.parse(userAddress))
    .endCell()
  const response = await client.runMethod(
    Address.parse(jettonMasterAddress),
    'get_wallet_address',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    [{ type: 'slice', cell: userAddressCell }]
  )
  return response.stack.readAddress().toRawString()
}
