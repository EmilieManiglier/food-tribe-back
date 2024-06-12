import Place from '#models/place'
import User from '#models/user'
import { placeValidator } from '#validators/place'
import type { HttpContext } from '@adonisjs/core/http'

// TODO : Refactor this controller to be more DRY
export default class PlaceController {
  async index({ response, auth }: HttpContext) {
    // If the user is authenticated, returns the places related to the user
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('places')
      return response.ok(user.places)
    }
  }

  async show({ response, params, auth }: HttpContext) {
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('places')
      const place = user.places.find((p) => p.id.toString() === params.id)

      if (place) {
        return response.ok(place)
      } else {
        return response.unauthorized('You do not have access to this place')
      }
    }
  }

  async store({ request, response, auth }: HttpContext) {
    if (auth.user) {
      const payload = await request.validateUsing(placeValidator)
      const user = await User.findOrFail(auth.user.id)
      const place = new Place()
      place.fill(payload)
      await user.related('places').save(place)
      return response.created(place)
    }
  }

  async update({ request, response, params, auth }: HttpContext) {
    if (auth.user) {
      const payload = await request.validateUsing(placeValidator)
      const user = await User.findOrFail(auth.user.id)
      await user.load('places')
      const place = user.places.find((p) => p.id.toString() === params.id)

      if (place) {
        place.merge(payload)
        await place.save()
        return response.ok(place)
      } else {
        return response.unauthorized('You do not have access to this place')
      }
    }
  }
}
