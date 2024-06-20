import type { HttpContext } from '@adonisjs/core/http'
import FriendGroup from '#models/friend_group'
import User from '#models/user'
import BaseController from '#controllers/base_controller'

export default class FriendGroupController extends BaseController {
  private async getFriendGroupOfUser(user: User, groupId: number): Promise<FriendGroup> {
    await user.load('friendGroups', (friendGroupsQuery) => {
      friendGroupsQuery.where('id', groupId)
    })
    return user.friendGroups[0]
  }

  async index({ response, auth }: HttpContext) {
    const user = await this.getAuthenticatedUser(auth, response)
    // If the user is authenticated, returns the friend groups of the user
    if (user) {
      await user.load('friendGroups', (friendGroupsQuery) => {
        friendGroupsQuery.preload('users')
      })

      // Set the admin of the friend group as the first user in the users array
      user.friendGroups.forEach((friendGroup) => {
        friendGroup.users.sort((a, b) => {
          if (a.id === friendGroup.admin) return -1
          if (b.id === friendGroup.admin) return 1
          return 0
        })
      })

      // Sort the user friend groups by created date
      user.friendGroups.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1
      })

      return response.ok(user.friendGroups)
    }
  }

  async show({ response, params, auth }: HttpContext) {
    const user = await this.getAuthenticatedUser(auth, response)
    if (user) {
      const friendGroup = await this.getFriendGroupOfUser(user, params.id)
      if (friendGroup) {
        return response.ok(friendGroup)
      } else {
        return response.notFound('Friend group not found')
      }
    }
  }

  // Update the name of an existing friend group of the authenticated user
  // If the user is not the admin of the friend group, return a 401 status code
  async update({ request, response, params, auth }: HttpContext) {
    const user = await this.getAuthenticatedUser(auth, response)
    if (user) {
      const friendGroup = await this.getFriendGroupOfUser(user, params.id)

      if (friendGroup) {
        if (friendGroup.admin === user.id) {
          const updatedData = request.only(['name', 'description'])
          friendGroup.merge(updatedData)
          await friendGroup.save()
          return response.ok(friendGroup)
        } else {
          return response.unauthorized('You are not the admin of this friend group')
        }
      } else {
        return response.notFound('Friend group not found')
      }
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const user = await this.getAuthenticatedUser(auth, response)
    if (user) {
      const payload = request.only(['name', 'description'])
      const friendGroup = new FriendGroup()
      friendGroup.fill(payload)

      // Assign the authenticated user as admin of the group
      friendGroup.admin = user.id
      await user.related('friendGroups').save(friendGroup)

      return response.created(friendGroup)
    }
  }

  async destroy({ response, params, auth }: HttpContext) {
    // Delete the friend group if the authenticated user is the admin
    const user = await this.getAuthenticatedUser(auth, response)
    if (user) {
      const friendGroup = await this.getFriendGroupOfUser(user, params.id)
      if (friendGroup) {
        if (friendGroup.admin === user.id) {
          // Remove the relationship between the user and the friend group
          await user.related('friendGroups').detach([friendGroup.id])
          await friendGroup.delete()
          return response.noContent()
        } else {
          return response.unauthorized('You are not the admin of this friend group')
        }
      } else {
        return response.notFound('Friend group not found')
      }
    }
  }
}
