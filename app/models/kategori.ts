import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Kategori extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama_kategori: string
}
