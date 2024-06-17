import Category from '#models/category'
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
      await user.load('places', (placesQuery) => {
        placesQuery.preload('categories')
      })
      return response.ok(user.places)
    }
  }

  async show({ response, params, auth }: HttpContext) {
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('places', (placesQuery) => {
        placesQuery.preload('categories')
      })
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

      // Find or create categories and attach them to the place
      const placeCategories = request.input('categories', [])
      const categories = await Promise.all(
        placeCategories.map(async ({ id }) => Category.firstOrCreate({ id }))
      )
      await place.related('categories').attach(categories.map((category) => category.id))

      // Load the categories relationship to return it in the response
      await place.load('categories')

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
        // Load the categories relationship to return it in the response
        await place.load('categories')
        place.merge(payload)
        await place.save()
        return response.ok(place)
      } else {
        return response.unauthorized('You do not have access to this place')
      }
    }
  }

  async destroy({ response, params, auth }: HttpContext) {
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('places')
      const place = user.places.find((p) => p.id.toString() === params.id)

      if (place) {
        // Removes the relationship between the user and the place
        await user.related('places').detach([place.id])

        // Removes the relationship between the place and its categories
        await place.related('categories').detach()

        await place.delete()
        return response.noContent()
      } else {
        return response.unauthorized('You do not have access to this place')
      }
    }
  }
}
