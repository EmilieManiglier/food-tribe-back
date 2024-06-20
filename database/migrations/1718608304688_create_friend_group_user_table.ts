import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FriendGroupUser extends BaseSchema {
  protected tableName = 'friend_group_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('friend_group_id').unsigned().references('id').inTable('friend_groups')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
