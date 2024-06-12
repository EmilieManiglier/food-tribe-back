import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlaceController {
  async index({ response, auth }: HttpContext) {
    // If the user is authenticated, returns the places related to the user
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('places')
      return response.ok(user.places)
    }
  }
}
