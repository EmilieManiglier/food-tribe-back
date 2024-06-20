import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FriendGroups extends BaseSchema {
  protected tableName = 'friend_groups'
  protected placesTableName = 'places'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('description').nullable()
      table.integer('admin').unsigned().references('id').inTable('users')
      table.timestamps(true)
    })

    this.schema.table(this.placesTableName, (table) => {
      table.integer('friend_group_id').unsigned().references('id').inTable('friend_groups')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.table(this.placesTableName, (table) => {
      table.dropColumn('friend_group_id')
    })
  }
}
