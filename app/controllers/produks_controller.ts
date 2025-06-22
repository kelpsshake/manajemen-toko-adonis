// app/controllers/produk_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Produk from '#models/produk'
import Kategori from '#models/kategori'
import Supplier from '#models/supplier'
import vine from '@vinejs/vine'

export default class ProdukController {
  async index({ view }: HttpContext) {
    // Ambil data produk beserta relasi kategori dan supplier-nya
    const produks = await Produk.query().preload('kategori').preload('supplier')
    return view.render('produk/index', { produks })
  }

  async create({ view }: HttpContext) {
    // Ambil semua data kategori dan supplier untuk dropdown di form
    const kategoris = await Kategori.all()
    const suppliers = await Supplier.all()
    return view.render('produk/create', { kategoris, suppliers })
  }

  async store({ request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        namaProduk: vine.string().trim().minLength(3),
        harga: vine.number().positive(),
        stok: vine.number().min(0),
        kategoriId: vine.number().exists(async (db, value) => {
          return !!(await db.from('kategoris').where('id', value).first())
        }),
        supplierId: vine.number().exists(async (db, value) => {
          return !!(await db.from('suppliers').where('id', value).first())
        }),
      })
    )

    try {
      const data = await request.validateUsing(validator)
      await Produk.create(data)
      session.flash('success', 'Produk berhasil ditambahkan.')
      return response.redirect().toRoute('produk.index')
    } catch (error) {
      session.flashAll()
      session.flash('error', `Gagal menambahkan produk: ${error.message}`)
      return response.redirect().back()
    }
  }

  async edit({ params, view }: HttpContext) {
    const produk = await Produk.findOrFail(params.id)
    const kategoris = await Kategori.all()
    const suppliers = await Supplier.all()
    return view.render('produk/edit', { produk, kategoris, suppliers })
  }

  async update({ params, request, response, session }: HttpContext) {
    const produk = await Produk.findOrFail(params.id)
    const validator = vine.compile(
      vine.object({
        namaProduk: vine.string().trim().minLength(3),
        harga: vine.number().positive(),
        stok: vine.number().min(0),
        kategoriId: vine.number().exists(async (db, value) => {
          return !!(await db.from('kategoris').where('id', value).first())
        }),
        supplierId: vine.number().exists(async (db, value) => {
          return !!(await db.from('suppliers').where('id', value).first())
        }),
      })
    )

    try {
      const data = await request.validateUsing(validator)
      produk.merge(data)
      await produk.save()
      session.flash('success', 'Produk berhasil diperbarui.')
      return response.redirect().toRoute('produk.index')
    } catch (error) {
      session.flashAll()
      session.flash('error', `Gagal memperbarui produk: ${error.message}`)
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    const produk = await Produk.findOrFail(params.id)
    await produk.delete()
    session.flash('success', 'Produk berhasil dihapus.')
    return response.redirect().toRoute('produk.index')
  }
}