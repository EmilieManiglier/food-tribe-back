import Place from '#models/place'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlaceController {
  async index({ response }: HttpContext) {
    const places = await Place.query().preload('categories')
    return response.ok(places)
  }
}
