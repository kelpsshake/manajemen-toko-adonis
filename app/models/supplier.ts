// app/models/supplier.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  // Diubah dari nama_supplier menjadi namaSupplier
  @column()
  public namaSupplier!: string

  @column()
  public alamat!: string | null

  @column()
  public telepon!: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}