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
