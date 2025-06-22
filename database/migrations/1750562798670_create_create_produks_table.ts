// database/migrations/...._create_produks_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama_produk').notNullable()
      table.integer('harga').unsigned().notNullable()
      table.integer('stok').unsigned().notNullable().defaultTo(0)

      // Foreign Key untuk Kategori
      table
        .integer('kategori_id')
        .unsigned()
        .references('id')
        .inTable('kategoris')
        .onDelete('SET NULL') // Jika kategori dihapus, kolom ini jadi NULL

      // Foreign Key untuk Supplier
      table
        .integer('supplier_id')
        .unsigned()
        .references('id')
        .inTable('suppliers')
        .onDelete('SET NULL') // Jika supplier dihapus, kolom ini jadi NULL

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}