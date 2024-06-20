import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class BaseController {
  async getAuthenticatedUser(auth: HttpContext['auth'], response: HttpContext['response']) {
    if (auth.user) {
      return await User.findOrFail(auth.user.id)
    }
    return response.unauthorized()
  }
}
