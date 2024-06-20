import Place from '#models/place'
import User from '#models/user'
import { placeValidator } from '#validators/place'
import type { HttpContext } from '@adonisjs/core/http'

// TODO : Refactor this controller to be more DRY
export default class PlaceController {
  async index({ response, request }: HttpContext) {
    const { friendGroupId } = request.all()
    let places: Place[] = []
    if (friendGroupId) {
      places = await Place.query()
        .whereHas('friendGroup', (query) => {
          query.where('id', friendGroupId)
        })
        .preload('categories')
        .exec()
    } else {
      places = await Place.query().preload('categories').exec()
    }
    return response.ok(places)
  }

  async store({ request, response, auth }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ error: 'User is not authenticated' })
    }

    const payload = await request.validateUsing(placeValidator)
    const place = await Place.create(payload)
    await place.related('categories').attach(payload.categories.map((category) => category.id))

    // Load the categories relationship to return it in the response
    await place.load('categories')

    return response.created(place)
  }

  async update({ request, response, params, auth }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ error: 'User is not authenticated' })
    }

    const payload = await request.validateUsing(placeValidator)

    // Find the authenticated user and its friend groups
    const user = await User.findOrFail(auth.user.id)
    await user.load('friendGroups', (friendGroupsQuery) => {
      friendGroupsQuery.preload('places')
    })

    // Check if the place is in one of the user's friend groups
    const placeInFriendGroup = user.friendGroups.find((friendGroup) => {
      return friendGroup.places.find((place) => place.id.toString() === params.id)
    })

    if (!placeInFriendGroup) {
      return response.unauthorized({ error: 'Unauthorized access to the place' })
    }

    // If the place is in one of the user's friend groups, update it
    const place = await Place.findOrFail(params.id)
    place.merge(payload)
    await place.save()

    // Update the categories relationship
    await place.related('categories').sync(payload.categories.map((category) => category.id))

    // Load the categories relationship to return it in the response
    await place.load('categories')

    return response.ok(place)
  }

  async destroy({ response, params, auth }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ error: 'User is not authenticated' })
    }

    // Find the authenticated user and its friend groups
    const user = await User.findOrFail(auth.user.id)
    await user.load('friendGroups', (friendGroupsQuery) => {
      friendGroupsQuery.preload('places')
    })

    // Check if the place is in one of the user's friend groups
    const placeInFriendGroup = user.friendGroups.find((friendGroup) => {
      return friendGroup.places.find((place) => place.id.toString() === params.id)
    })

    if (!placeInFriendGroup) {
      return response.unauthorized({ error: 'Unauthorized access to the place' })
    }

    // If the place is in one of the user's friend groups, delete it
    const place = await Place.findOrFail(params.id)

    // Removes the relationship between the place and its categories
    await place.related('categories').detach()

    await place.delete()

    return response.noContent()
  }
}
