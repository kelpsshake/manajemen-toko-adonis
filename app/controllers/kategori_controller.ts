import type { HttpContext } from '@adonisjs/core/http'
import Kategori from '#models/kategori'
import vine from '@vinejs/vine'

export default class KategoriController {
  async index({ view, response, session }: HttpContext) {
    try {
      const kategoris = await Kategori.all()
      return view.render('kategori/index', { kategoris })
    } catch (error) {
      session.flash('error', 'Gagal memuat data kategori.')
      return response.redirect().back()
    }
  }

  async create({ view }: HttpContext) {
    return view.render('kategori/create')
  }

  async store({ request, response, session }: HttpContext) {
    try {
      const kategoriSchema = vine.compile(
        vine.object({
          nama_kategori: vine.string().minLength(3),
        })
      )

      const data = await request.validateUsing(kategoriSchema)
      await Kategori.create(data)

      session.flash('success', 'Kategori berhasil ditambahkan.')
      return response.redirect().toRoute('kategori.index')
    } catch (error) {
      if (error.messages) {
        // Validation error
        session.flashExcept(['_token'])
        session.flashAll()
        return response.redirect().back()
      }
      
      session.flash('error', 'Gagal menambahkan kategori.')
      return response.redirect().back()
    }
  }

  async show({ params, view, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)
      return view.render('kategori/show', { kategori })
    } catch (error) {
      session.flash('error', 'Kategori tidak ditemukan.')
      return response.redirect().toRoute('kategori.index')
    }
  }

  async edit({ params, view, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)
      return view.render('kategori/edit', { kategori })
    } catch (error) {
      session.flash('error', 'Kategori tidak ditemukan.')
      return response.redirect().toRoute('kategori.index')
    }
  }

  async update({ params, request, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)

      const kategoriSchema = vine.compile(
        vine.object({
          nama_kategori: vine.string().minLength(3),
        })
      )

      const data = await request.validateUsing(kategoriSchema)
      kategori.merge(data)
      await kategori.save()

      session.flash('success', 'Kategori berhasil diperbarui.')
      return response.redirect().toRoute('kategori.index')
    } catch (error) {
      if (error.messages) {
        // Validation error
        session.flashExcept(['_token'])
        session.flashAll()
        return response.redirect().back()
      }
      
      session.flash('error', 'Gagal memperbarui kategori.')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)
      await kategori.delete()

      session.flash('success', 'Kategori berhasil dihapus.')
      return response.redirect().toRoute('kategori.index')
    } catch (error) {
      session.flash('error', 'Gagal menghapus kategori.')
      return response.redirect().toRoute('kategori.index')
    }
  }
}