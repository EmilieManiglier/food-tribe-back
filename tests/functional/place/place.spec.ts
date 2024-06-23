import User from '#models/user'
import { test } from '@japa/runner'

test.group('Place controller', (group) => {
  let payload = {
    name: 'Addresse test',
    lat: '45.75943070454282',
    lng: '4.8720428220032055',
    address: 'Rue de la paix',
    categories: [{ id: 1, name: 'Restaurant' }],
    friendGroupId: 1,
    zipCode: '69002',
    city: 'Lyon',
  }
  let user: User

  group.each.setup(async () => {
    user = await User.findOrFail(1)
  })

  test('creates a place', async ({ client }): Promise<void> => {
    const response = await client.post('/api/v1/places').json(payload).loginAs(user)
    response.assertStatus(201)
  })

  test('returns a list of places', async ({ client }): Promise<void> => {
    const response = await client.get('/api/v1/places').loginAs(user)
    response.assertStatus(200)
  })

  test('updates a place', async ({ client }): Promise<void> => {
    payload = { ...payload, name: 'New place name' }
    const response = await client.put('/api/v1/places/2').json(payload).loginAs(user)
    response.assertBodyContains({ name: 'New place name' })
  })

  test('deletes a place', async ({ client }): Promise<void> => {
    const response = await client.delete('/api/v1/places/1').loginAs(user)
    response.assertStatus(204)
  })
})
