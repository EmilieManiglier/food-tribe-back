import type { HttpContext } from '@adonisjs/core/http'
import FriendGroup from '#models/friend_group'
import User from '#models/user'

export default class FriendGroupController {
  async index({ response, auth }: HttpContext) {
    // If the user is authenticated, returns the friend groups of the user
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
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
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('friendGroups', (friendGroupsQuery) => {
        friendGroupsQuery.where('id', params.id)
      })

      const friendGroup = user.friendGroups[0]
      if (friendGroup) {
        return response.ok(friendGroup)
      } else {
        return response.notFound('Friend group not found')
      }
    } else {
      return response.unauthorized('User is not authenticated')
    }
  }

  // Update the name of an existing friend group of the authenticated user
  // If the user is not the admin of the friend group, return a 401 status code
  async update({ request, response, params, auth }: HttpContext) {
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('friendGroups', (friendGroupsQuery) => {
        friendGroupsQuery.where('id', params.id)
      })

      const friendGroup = user.friendGroups[0]
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
    if (auth.user) {
      const payload = request.only(['name', 'description'])
      const user = await User.findOrFail(auth.user.id)
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
    if (auth.user) {
      const user = await User.findOrFail(auth.user.id)
      await user.load('friendGroups', (friendGroupsQuery) => {
        friendGroupsQuery.where('id', params.id)
      })

      const friendGroup = user.friendGroups[0]
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
