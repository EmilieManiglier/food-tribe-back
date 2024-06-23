import { test } from '@japa/runner'

test.group('Auth controller', () => {
  test('registers new user', async ({ client }) => {
    const newUser = {
      email: 'new_user@test.fr',
      password: 'password',
      firstname: 'John',
      lastname: 'Doe',
    }
    const response = await client.post('/api/v1/auth/register').json(newUser)
    response.assertStatus(200)
  })
})
