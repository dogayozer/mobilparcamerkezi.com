import crypto from 'crypto'

export interface PayTRPaymentParams {
  email: string
  payment_amount: number // in kuruş (e.g. 100.50 TL -> 10050)
  merchant_oid: string
  user_name: string
  user_address: string
  user_phone: string
  merchant_ok_url: string
  merchant_fail_url: string
  user_basket: Array<[string, string, number]> // [name, price, quantity]
  user_ip: string
  timeout_limit?: number
  debug_on?: number
  test_mode?: number
  no_installment?: number
  max_installment?: number
  currency?: string
}

export function generatePayTRToken(params: PayTRPaymentParams) {
  const merchant_id = process.env.PAYTR_MERCHANT_ID || ''
  const merchant_key = process.env.PAYTR_MERCHANT_KEY || ''
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT || ''

  if (!merchant_id || !merchant_key || !merchant_salt) {
    throw new Error('PayTR credentials are not configured in environment variables')
  }

  const user_basket_json = JSON.stringify(params.user_basket)
  const user_basket_base64 = Buffer.from(user_basket_json).toString('base64')

  const timeout_limit = params.timeout_limit || 30
  const debug_on = params.debug_on || 1
  const test_mode = params.test_mode || 0
  const no_installment = params.no_installment || 0
  const max_installment = params.max_installment || 0
  const currency = params.currency || 'TL'

  // Hash string format for PayTR
  const hash_str = `${merchant_id}${params.user_ip}${params.merchant_oid}${params.email}${params.payment_amount}${user_basket_base64}${no_installment}${max_installment}${currency}${test_mode}`
  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(hash_str + merchant_salt)
    .digest('base64')

  return {
    merchant_id,
    user_ip: params.user_ip,
    merchant_oid: params.merchant_oid,
    email: params.email,
    payment_amount: params.payment_amount,
    paytr_token,
    user_basket: user_basket_base64,
    debug_on,
    no_installment,
    max_installment,
    user_name: params.user_name,
    user_address: params.user_address,
    user_phone: params.user_phone,
    merchant_ok_url: params.merchant_ok_url,
    merchant_fail_url: params.merchant_fail_url,
    timeout_limit,
    currency,
    test_mode,
  }
}

export function verifyPayTRHash(
  merchant_oid: string,
  status: string,
  total_amount: string,
  hash: string
): boolean {
  const merchant_key = process.env.PAYTR_MERCHANT_KEY || ''
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT || ''

  const calculated_hash = crypto
    .createHmac('sha256', merchant_key)
    .update(`${merchant_oid}${merchant_salt}${status}${total_amount}`)
    .digest('base64')

  return hash === calculated_hash
}
