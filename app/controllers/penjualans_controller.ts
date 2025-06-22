// app/controllers/penjualan_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Produk from '#models/produk'
import Penjualan from '#models/penjualan'
import StokLog from '#models/stok_log'
import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class PenjualanController {
  // Menampilkan daftar riwayat penjualan
  async index({ view }: HttpContext) {
    const penjualans = await Penjualan.query().preload('produk').orderBy('created_at', 'desc')
    return view.render('penjualan/index', { penjualans })
  }

  // Menampilkan form untuk membuat transaksi penjualan baru
  async create({ view }: HttpContext) {
    const produks = await Produk.query().orderBy('namaProduk', 'asc')
    return view.render('penjualan/create', { produks })
  }

  // Menyimpan transaksi penjualan
  async store({ request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        produkId: vine.number().exists(async (db, value) => {
          return !!(await db.from('produks').where('id', value).first())
        }),
        jumlah: vine.number().positive(),
      })
    )

    const data = await request.validateUsing(validator)
    const trx = await db.transaction() // Mulai Transaksi Database

    try {
      // Kunci baris produk agar tidak ada proses lain yang mengubah stok di saat yang sama
      const produk = await Produk.findOrFail(data.produkId, { client: trx })
      // Jika Anda menggunakan MySQL atau PostgreSQL, Anda bisa menambahkan .forUpdate()
      // const produk = await Produk.query({ client: trx }).where('id', data.produkId).forUpdate().firstOrFail()

      // Validasi Stok
      if (produk.stok < data.jumlah) {
        throw new Error('Stok produk tidak mencukupi.')
      }

      // 1. Kurangi stok produk
      produk.stok -= data.jumlah
      await produk.save() // save() otomatis menggunakan transaksi (trx)

      const tanggalSekarang = DateTime.now()

      // 2. Buat record penjualan
      await Penjualan.create(
        {
          produkId: data.produkId,
          jumlah: data.jumlah,
          tanggal: tanggalSekarang,
        },
        { client: trx }
      )

      // 3. Buat log stok
      await StokLog.create(
        {
          produkId: data.produkId,
          jenis: 'keluar',
          jumlah: data.jumlah,
          tanggal: tanggalSekarang,
        },
        { client: trx }
      )

      await trx.commit() // Semua berhasil, simpan perubahan ke database
      session.flash('success', 'Transaksi penjualan berhasil disimpan.')
      return response.redirect().toRoute('penjualan.index')
    } catch (error) {
      await trx.rollback() // Terjadi kesalahan, batalkan semua perubahan
      session.flash('error', `Transaksi Gagal: ${error.message}`)
      return response.redirect().back()
    }
  }
}