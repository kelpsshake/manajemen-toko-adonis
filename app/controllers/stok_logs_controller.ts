// app/controllers/stok_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Produk from '#models/produk'
import StokLog from '#models/stok_log'
import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class StokController {
  /**
   * Menampilkan riwayat keluar-masuk stok
   */
  async index({ view }: HttpContext) {
    const logs = await StokLog.query().preload('produk').orderBy('created_at', 'desc')
    return view.render('stok/index', { logs })
  }

  /**
   * Menampilkan form untuk menambah stok
   */
  async create({ view }: HttpContext) {
    const produks = await Produk.query().orderBy('namaProduk', 'asc')
    return view.render('stok/create', { produks })
  }

  /**
   * Menyimpan data penambahan stok
   */
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
      const produk = await Produk.findOrFail(data.produkId, { client: trx })

      // 1. Tambah stok produk
      produk.stok += data.jumlah
      await produk.save()

      // 2. Buat log stok 'masuk'
      await StokLog.create(
        {
          produkId: data.produkId,
          jenis: 'masuk',
          jumlah: data.jumlah,
          tanggal: DateTime.now(),
        },
        { client: trx }
      )

      await trx.commit() // Simpan semua perubahan
      session.flash('success', 'Stok berhasil ditambahkan.')
      return response.redirect().toRoute('stok.index')
    } catch (error) {
      await trx.rollback() // Batalkan semua perubahan jika ada error
      session.flash('error', `Gagal menambahkan stok: ${error.message}`)
      return response.redirect().back()
    }
  }
}