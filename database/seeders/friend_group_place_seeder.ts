import FriendGroup from '#models/friend_group'
import Place from '#models/place'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class FriendGroupPlace extends BaseSeeder {
  async run() {
    const friendGroup = await FriendGroup.findByOrFail('id', 1)
    const places = await Place.query().limit(3)

    // Attach the places to the friend group (id 1)
    await friendGroup.related('places').saveMany(places)
  }
}
