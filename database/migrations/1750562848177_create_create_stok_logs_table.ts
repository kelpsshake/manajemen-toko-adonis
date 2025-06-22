import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stok_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('jenis', ['masuk', 'keluar']).notNullable() // 'masuk' untuk restock, 'keluar' untuk penjualan
      table.integer('jumlah').unsigned().notNullable()
      table.timestamp('tanggal').notNullable()

      table
        .integer('produk_id')
        .unsigned()
        .references('id')
        .inTable('produks')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}