import { NextResponse } from 'next/server'

// NOT: Bu endpoint artık DEVRE DIŞI.
// Fodos ile ortak/paylaşılan veritabanına geçildikten sonra (bkz. mobilparcamerkezi/.env),
// buradan yapılacak bir Excel yüklemesi Fodos'un da canlı fiyat/stok verilerini
// (aynı Product tablosu, aynı barkod eşleştirmesi) ezerdi. Ürün/stok/fiyat yönetimi artık
// SADECE Fodos'un merkezi admin panelinden (/admin, "Excel ile Ürün Yükleme") yapılmalı.
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Bu panel artık ürün/stok yüklemesi için kullanılmıyor. Fodos ile ortak veritabanı kullanıldığı için ürün, stok ve fiyat yönetimi merkezi Fodos admin panelinden yapılmalıdır.',
    },
    { status: 410 }
  )
}
