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
const CategoryController = () => import('#controllers/category_controller')
const FriendGroupController = () => import('#controllers/friend_group_controller')
const PlaceController = () => import('#controllers/place_controller')
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [AuthController, 'register'])
        router.post('login', [AuthController, 'login'])
        router.post('logout', [AuthController, 'logout']).use(middleware.auth())
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/', [FriendGroupController, 'index'])
        router.get('/:id', [FriendGroupController, 'show'])
        router.put('/:id', [FriendGroupController, 'update'])
        router.post('/', [FriendGroupController, 'store'])
        router.delete('/:id', [FriendGroupController, 'destroy'])
      })
      .prefix('friendGroups')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [PlaceController, 'index'])
        router.put('/:id', [PlaceController, 'update'])
        router.post('/', [PlaceController, 'store'])
        router.delete('/:id', [PlaceController, 'destroy'])
      })
      .prefix('places')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [CategoryController, 'index'])
      })
      .prefix('categories')
      .use(middleware.auth())
  })
  .prefix('api/v1')
