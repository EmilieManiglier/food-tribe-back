import BaseController from '#controllers/base_controller'
import Place from '#models/place'
import User from '#models/user'
import { placeValidator } from '#validators/place'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlaceController extends BaseController {
  private async fetchPlaces(friendGroupId?: number): Promise<Place[]> {
    let query = Place.query().preload('categories')
    if (friendGroupId) {
      query = query.whereHas('friendGroup', (placeQuery) => {
        placeQuery.where('id', friendGroupId)
      })
    }
    return await query.exec()
  }

  // Check if the user has access to the place
  private async authorizePlace(user: User, placeId: string, response: HttpContext['response']) {
    await user.load('friendGroups', (friendGroupsQuery) => {
      friendGroupsQuery.preload('places')
    })

    // Check if the place is in one of the user's friend groups
    const placeInFriendGroup = user.friendGroups.find((friendGroup) => {
      return friendGroup.places.find((place) => place.id.toString() === placeId)
    })

    if (!placeInFriendGroup) {
      return response.unauthorized({ error: 'Unauthorized access to the place' })
    }

    // If the place is in one of the user's friend groups, return it
    return await Place.findOrFail(placeId)
  }

  async index({ response, request }: HttpContext) {
    const { friendGroupId } = request.all()
    const places = await this.fetchPlaces(friendGroupId)
    return response.ok(places)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(placeValidator)
    const place = await Place.create(payload)
    await place.related('categories').attach(payload.categories.map((category) => category.id))

    // Load the categories relationship to return it in the response
    await place.load('categories')

    return response.created(place)
  }

  async update({ request, response, params, auth }: HttpContext) {
    const payload = await request.validateUsing(placeValidator)

    // Find the authenticated user and its friend groups
    const user = await this.getAuthenticatedUser(auth, response)
    if (!user) return

    // If the place is in one of the user's friend groups, update it
    const place = await this.authorizePlace(user, params.id, response)
    if (!place) return
    place.merge(payload)
    await place.save()

    // Update the categories relationship
    await place.related('categories').sync(payload.categories.map((category) => category.id))

    // Load the categories relationship to return it in the response
    await place.load('categories')

    return response.ok(place)
  }

  async destroy({ response, params, auth }: HttpContext) {
    // Find the authenticated user and its friend groups
    const user = await this.getAuthenticatedUser(auth, response)
    if (!user) return

    // If the place is in one of the user's friend groups, delete it
    const place = await this.authorizePlace(user, params.id, response)
    if (!place) return

    // Removes the relationship between the place and its categories
    await place.related('categories').detach()

    await place.delete()

    return response.noContent()
  }
}
