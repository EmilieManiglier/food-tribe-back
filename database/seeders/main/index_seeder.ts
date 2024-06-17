import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class MainSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/category_seeder'))
    await this.seed(await import('#database/seeders/place_seeder'))
    await this.seed(await import('#database/seeders/place_user_seeder'))
  }
}
