import Category from '#models/category'
import Place from '#models/place'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PlaceSeeder extends BaseSeeder {
  async run() {
    const places = [
      {
        name: 'Le goût de Kyun',
        lat: 45.7674630890759,
        lng: 4.830760359631816,
      },
      {
        name: 'Messob',
        lat: 45.76713378601963,
        lng: 4.85505044453237,
      },
      {
        name: 'Le petit Brivadois',
        lat: 45.75979007339314,
        lng: 4.872778676852256,
      },
    ]
    const createdPlaces = await Place.createMany(places)

    const categories = await Category.all()
    const placeToCategories = {
      'Le goût de Kyun': ['Restaurant'],
      'Messob': ['Restaurant'],
      'Le petit Brivadois': ['Boulangerie'],
    }

    for (let place of createdPlaces) {
      const placeCategories = placeToCategories[place.name]
      const categoryIds = categories
        .filter((category) => placeCategories.includes(category.name))
        .map((category) => category.id)
      await place.related('categories').attach(categoryIds)
    }
  }
}
