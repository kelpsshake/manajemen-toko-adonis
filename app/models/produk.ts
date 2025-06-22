// app/models/produk.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Kategori from '#models/kategori'
import Supplier from '#models/supplier'

export default class Produk extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public namaProduk!: string

  @column()
  public harga!: number

  @column()
  public stok!: number

  @column()
  public kategoriId!: number | null

  @column()
  public supplierId!: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  // Relasi ke Model Kategori
  @belongsTo(() => Kategori)
  public kategori!: BelongsTo<typeof Kategori>

  // Relasi ke Model Supplier
  @belongsTo(() => Supplier)
  public supplier!: BelongsTo<typeof Supplier>
}