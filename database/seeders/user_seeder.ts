import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker/locale/fr'

import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  static environment = ['development']

  async run() {
    const users = Array.from({ length: 10 }, (_, index) => ({
      email: `user-${index + 1}@kinoba.fr`,
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      password: 'password',
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      country: 'france',
    }))
    await User.createMany(users)
  }
}
