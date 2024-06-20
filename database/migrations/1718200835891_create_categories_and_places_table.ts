import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected placesTableName = 'places'
  protected categoriesTableName = 'categories'
  protected pivotTableName = 'category_place'

  async up() {
    this.schema.createTable(this.placesTableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.float('lat').notNullable()
      table.float('lng').notNullable()
      table.string('description').nullable()
      table.string('street_address').nullable()
      table.string('zip_code').nullable()
      table.string('city').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(this.categoriesTableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(this.pivotTableName, (table) => {
      table.integer('category_id').unsigned().references('id').inTable('categories')
      table.integer('place_id').unsigned().references('id').inTable('places')
      table.primary(['category_id', 'place_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.placesTableName)
    this.schema.dropTable(this.categoriesTableName)
    this.schema.dropTable(this.pivotTableName)
  }
}
