import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('firstname').nullable()
      table.string('lastname').nullable()
      table.string('email', 255).notNullable().unique()
      table.string('password').notNullable()
      table.string('street_address').nullable()
      table.string('city').nullable()
      table.string('zip_code').nullable()
      table.string('country').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
