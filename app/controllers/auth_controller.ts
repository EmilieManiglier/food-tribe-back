import type { HttpContext } from '@adonisjs/core/http'
import DB from '@adonisjs/lucid/services/db'

import { registerValidator, loginValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    return response.created(user)
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      user,
      token: token.toJSON().token,
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = await User.findOrFail(auth.user?.id)
    await User.accessTokens.delete(user, user.id)
    await DB.from('auth_access_tokens').where('tokenable_id', user.id).delete()
    return response.ok({})
  }
}
