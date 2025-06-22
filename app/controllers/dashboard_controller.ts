import type { HttpContext } from '@adonisjs/core/http'
import Produk from '#models/produk'
import Kategori from '#models/kategori'
import Supplier from '#models/supplier'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DashboardController {
  public async index({ view }: HttpContext) {
    // Menghitung total data master
     const totalProdukData = await Produk.query().count('* as total').first()
    const totalKategoriData = await Kategori.query().count('* as total').first()
    const totalSupplierData = await Supplier.query().count('* as total').first()

    const totalProduk = totalProdukData ? Number((totalProdukData as any).total) : 0
    const totalKategori = totalKategoriData ? Number((totalKategoriData as any).total) : 0
    const totalSupplier = totalSupplierData ? Number((totalSupplierData as any).total) : 0

    // Menghitung total nilai penjualan HARI INI
    const todayStart = DateTime.now().startOf('day').toSQL()
    const todayEnd = DateTime.now().endOf('day').toSQL()

    // Perbaikan query ada di sini
    const penjualanHariIni = await db
      .from('penjualans')
      .join('produks', 'penjualans.produk_id', 'produks.id')
      .whereBetween('penjualans.tanggal', [todayStart, todayEnd])
      .select(db.raw('sum(penjualans.jumlah * produks.harga) as total_nilai'))
      .first()

    const totalPenjualanHarian = penjualanHariIni?.total_nilai || 0

    // Mengambil produk yang stoknya hampir habis (misal: kurang dari 10)
    const produkHampirHabis = await Produk.query()
      .where('stok', '<', 10)
      .orderBy('stok', 'asc')

    // Mengirim semua data ke view
    return view.render('pages/dashboard', {
      totalProduk,
      totalKategori,
      totalSupplier,
      totalPenjualanHarian,
      produkHampirHabis,
    })
  }
}