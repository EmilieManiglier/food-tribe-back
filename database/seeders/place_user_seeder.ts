import Category from '#models/category'
import Place from '#models/place'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PlaceSeeder extends BaseSeeder {
  async run() {
    const places = await Place.all()
    const firstUser = await User.findByOrFail('id', 1)
    const secondUser = await User.findByOrFail('id', 2)
    await firstUser.related('places').attach(places.map((place) => place.id))

    // Attach only the first place to the second user
    await secondUser.related('places').attach([places[0].id])
  }
}
