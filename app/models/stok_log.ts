import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Produk from '#models/produk'

export default class StokLog extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public jenis!: 'masuk' | 'keluar'

  @column()
  public jumlah!: number

  @column.dateTime()
  public tanggal!: DateTime

  @column()
  public produkId!: number

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Produk)
  public produk!: BelongsTo<typeof Produk>
}