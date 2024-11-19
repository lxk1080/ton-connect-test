
export interface TonTxParams {
  valid_until?: number | bigint
  validUntil?: number | bigint
  network?: string
  from?: string
  messages: {
    address: string
    amount: string
    stateInit?: string
    payload?: string
  }[]
}

export interface TonTxRequestStandard {
  body: {
    messages: {
      address: string
      amount: string
      payload?: string
      stateInit?: string
    }[]
  }
  validUntil: number
  publicKey: string
  fromAddress: string
  jettonInfo: any
}
