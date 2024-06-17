import type { HttpContext } from '@adonisjs/core/http'

import Category from '#models/category'

export default class CategoryController {
  async index({ response }: HttpContext) {
    // Return the list of all categories
    const categories = await Category.all()
    return response.ok(categories)
  }
}
