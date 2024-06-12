import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UserPlacePivot extends BaseSchema {
  protected tableName = 'place_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('place_id').unsigned().references('id').inTable('places')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
