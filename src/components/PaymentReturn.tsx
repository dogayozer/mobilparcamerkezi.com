'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'

// PayTR ödeme sonrası müşteriyi merchant_ok_url / merchant_fail_url'e yönlendirir; iFrame API'de bu yönlendirme
// ödeme penceresinin (iframe) İÇİNDE olur. Bu yüzden önce (başarılıysa) sepet temizlenir, sonra sayfa iframe
// içindeyse üst pencereye taşınır; müşteri sonucu tam sayfa görür ve sepet taze yüklenir.
// Sepet hem CartContext durumundan hem localStorage'dan silinir; CartContext yükleme sırasına bağlı kalmamak
// için bir kez daha kısa süre sonra tekrarlanır.
export default function PaymentReturn({ clearCart: shouldClear = false }: { clearCart?: boolean }) {
  const { clearCart } = useCart()
  const clearRef = useRef(clearCart)
  clearRef.current = clearCart

  useEffect(() => {
    const clearAll = () => {
      try { localStorage.removeItem('mpm_cart') } catch {}
      clearRef.current()
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    if (shouldClear) {
      clearAll()
      timer = setTimeout(clearAll, 500)
    }
    if (window.self !== window.top) {
      try { window.top!.location.href = window.location.href } catch {}
    }
    return () => { if (timer) clearTimeout(timer) }
  }, [shouldClear])

  return null
}
