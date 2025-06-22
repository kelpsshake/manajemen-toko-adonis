// app/controllers/supplier_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier'
import vine from '@vinejs/vine'

export default class SupplierController {
  // Menampilkan semua supplier
  async index({ view }: HttpContext) {
    const suppliers = await Supplier.all()
    return view.render('supplier/index', { suppliers })
  }

  // Menampilkan form untuk membuat supplier baru
  async create({ view }: HttpContext) {
    return view.render('supplier/create')
  }

  // Menyimpan supplier baru ke database
  async store({ request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        nama_supplier: vine.string().trim().minLength(3),
        alamat: vine.string().trim().optional(),
        telepon: vine.string().trim().optional(),
      })
    )

    try {
      const data = await request.validateUsing(validator)
      await Supplier.create(data)

      session.flash('success', 'Supplier berhasil ditambahkan.')
      return response.redirect().toRoute('supplier.index')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan supplier. Periksa kembali data Anda.')
      return response.redirect().back()
    }
  }

  // Menampilkan form untuk mengedit supplier
  async edit({ params, view, session, response }: HttpContext) {
    try {
      const supplier = await Supplier.findOrFail(params.id)
      return view.render('supplier/edit', { supplier })
    } catch (error) {
      session.flash('error', 'Supplier tidak ditemukan.')
      return response.redirect().toRoute('supplier.index')
    }
  }

  // Memperbarui data supplier di database
  async update({ params, request, response, session }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        nama_supplier: vine.string().trim().minLength(3),
        alamat: vine.string().trim().optional(),
        telepon: vine.string().trim().optional(),
      })
    )

    try {
      const supplier = await Supplier.findOrFail(params.id)
      const data = await request.validateUsing(validator)

      supplier.merge(data)
      await supplier.save()

      session.flash('success', 'Supplier berhasil diperbarui.')
      return response.redirect().toRoute('supplier.index')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui supplier.')
      return response.redirect().back()
    }
  }

  // Menghapus supplier dari database
  async destroy({ params, response, session }: HttpContext) {
    try {
      const supplier = await Supplier.findOrFail(params.id)
      await supplier.delete()

      session.flash('success', 'Supplier berhasil dihapus.')
      return response.redirect().toRoute('supplier.index')
    } catch (error) {
      session.flash('error', 'Gagal menghapus supplier.')
      return response.redirect().toRoute('supplier.index')
    }
  }
}