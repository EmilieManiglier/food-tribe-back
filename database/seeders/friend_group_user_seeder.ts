import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import FriendGroup from '#models/friend_group'

export default class FriendGroupUserSeeder extends BaseSeeder {
  async run() {
    // Assign the first five users to the first group
    const firstGroup = await FriendGroup.findByOrFail('id', 1)
    const users = await User.query().limit(5)
    await firstGroup.related('users').saveMany(users)

    // Assign three users to the second group, with user 2 as the admin
    const secondGroup = await FriendGroup.findByOrFail('id', 2)
    const otherUsers = await User.query().whereIn('id', [4, 5, 6]).orWhere('id', 2)
    await secondGroup.related('users').saveMany(otherUsers)
  }
}
