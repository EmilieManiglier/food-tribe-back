import FriendGroup from '#models/friend_group'
import User from '#models/user'
import { test } from '@japa/runner'

test.group('Friend group controller', (group) => {
  let payload = {
    name: 'Groupe test',
    description: 'Groupe de test',
  }
  let user: User

  group.each.setup(async () => {
    user = await User.findOrFail(1)
  })

  test('returns a list of friend groups', async ({ client }) => {
    const response = await client.get('/api/v1/friendGroups').loginAs(user)
    response.assertStatus(200)
  })

  test('creates a friend group', async ({ client }) => {
    const response = await client.post('/api/v1/friendGroups').json(payload).loginAs(user)
    response.assertStatus(201)
  })

  test('updates a friend group if user is admin', async ({ client }) => {
    payload = { ...payload, name: 'New place name' }
    const lastFriendGroup = await FriendGroup.query().orderBy('id', 'desc').first()
    const lastFriendGroupId = lastFriendGroup?.id
    const response = await client
      .put(`/api/v1/friendGroups/${lastFriendGroupId}`)
      .json(payload)
      .loginAs(user)
    response.assertBodyContains({ name: 'New place name' })
  })

  test('cannot update a friend group if user is not admin', async ({ client }) => {
    const response = await client
      .put('/api/v1/friendGroups/1')
      .json(payload)
      .loginAs(await User.findOrFail(2))
    response.assertStatus(401)
  })

  test('cannot delete a friend group if user is not admin', async ({ client }) => {
    const response = await client.delete('/api/v1/friendGroups/1').loginAs(await User.findOrFail(2))
    response.assertStatus(401)
  })

  test('deletes a friend group if user is admin', async ({ client }) => {
    const lastFriendGroup = await FriendGroup.query().orderBy('id', 'desc').first()
    const lastFriendGroupId = lastFriendGroup?.id
    const response = await client.delete(`/api/v1/friendGroups/${lastFriendGroupId}`).loginAs(user)
    response.assertStatus(204)
  })
})
