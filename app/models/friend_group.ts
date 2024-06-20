import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Place from '#models/place'
import User from '#models/user'

export default class FriendGroup extends BaseModel {
  @hasMany(() => Place)
  declare places: HasMany<typeof Place>

  @manyToMany(() => User)
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
  declare description: string

  @column()
  declare admin: number
}
