import FriendGroup from '#models/friend_group'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class FriendGroupSeeder extends BaseSeeder {
  async run() {
    const firstUser = await User.findByOrFail('id', 1)
    const secondUser = await User.findByOrFail('id', 2)
    const friendGroups = [
      { name: 'KinoFood', description: "Manger c'est la vie", admin: firstUser.id },
      {
        name: 'Les manges-tôt',
        description: "Est-ce qu'il est déjà l'heure de manger ?!",
        admin: secondUser.id,
      },
    ]
    await FriendGroup.createMany(friendGroups)
  }
}
