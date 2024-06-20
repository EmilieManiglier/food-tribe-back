import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

test('hashes user password when creating a new user', async ({ assert }) => {
  const user = new User()
  user.email = 'test2002@test.fr'
  user.firstname = 'John'
  user.lastname = 'Doe'
  user.password = 'secret'

  await user.save()

  assert.isTrue(hash.isValidHash(user.password))
  assert.isTrue(await hash.verify(user.password, 'secret'))
})
