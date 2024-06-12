import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import User from '#models/user'

export default class Place extends BaseModel {
  @manyToMany(() => Category, {
    serializeAs: 'categories',
  })
  declare categories: ManyToMany<typeof Category>

  @manyToMany(() => User, { serializeAs: null })
  declare users: ManyToMany<typeof User>

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @column()
  declare name: string

  @column()
  declare lat: number

  @column()
  declare lng: number
}
