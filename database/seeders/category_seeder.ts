import Category from '#models/category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CategorySeeder extends BaseSeeder {
  async run() {
    const categories = [
      {
        name: 'Restaurant',
      },
      {
        name: 'Bar',
      },
      {
        name: 'Café',
      },
      {
        name: 'Boulangerie',
      },
      {
        name: 'Fast-food',
      },
    ]

    await Category.createMany(categories)
  }
}
