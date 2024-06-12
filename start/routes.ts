/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const PlaceController = () => import('#controllers/place_controller')
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [AuthController, 'register'])
        router.post('login', [AuthController, 'login'])
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('places', [PlaceController, 'index'])
      })
      .use(middleware.auth())
  })
  .prefix('api/v1')
