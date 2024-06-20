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

const authRoutes = () => {
  router.post('register', [AuthController, 'register'])
  router.post('login', [AuthController, 'login'])
  router.post('logout', [AuthController, 'logout']).use(middleware.auth())
}

const friendGroupRoutes = () => {
  router.get('/', [FriendGroupController, 'index'])
  router.get('/:id', [FriendGroupController, 'show'])
  router.put('/:id', [FriendGroupController, 'update'])
  router.post('/', [FriendGroupController, 'store'])
  router.delete('/:id', [FriendGroupController, 'destroy'])
}

const placeRoutes = () => {
  router.get('/', [PlaceController, 'index'])
  router.put('/:id', [PlaceController, 'update'])
  router.post('/', [PlaceController, 'store'])
  router.delete('/:id', [PlaceController, 'destroy'])
}

const categoryRoutes = () => {
  router.get('/', [CategoryController, 'index'])
}

router
  .group(() => {
    router.group(authRoutes).prefix('/auth')
    router.group(friendGroupRoutes).prefix('friendGroups').use(middleware.auth())
    router.group(placeRoutes).prefix('places').use(middleware.auth())
    router.group(categoryRoutes).prefix('categories').use(middleware.auth())
  })
  .prefix('api/v1')
