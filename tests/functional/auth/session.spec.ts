import User from '#models/user'
import { test } from '@japa/runner'

test.group('Auth controller', () => {
  test('logs in a user with valid credentials', async ({ client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'user-1@kinoba.fr',
      password: 'password',
    })
    response.assertStatus(200)
  })

  test('cannot log in with invalid credentials', async ({ client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'wrong_email@email.fr',
      password: 'wrong_password',
    })
    response.assertStatus(400)
  })

  test('logs out a user', async ({ client }) => {
    const user = await User.findOrFail(1)
    const response = await client.post('/api/v1/auth/logout').loginAs(user)
    response.assertStatus(200)
  })
})
