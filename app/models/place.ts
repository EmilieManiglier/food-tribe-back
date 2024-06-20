import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import FriendGroup from '#models/friend_group'

export default class Place extends BaseModel {
  @manyToMany(() => Category, {
    serializeAs: 'categories',
  })
  declare categories: ManyToMany<typeof Category>

  @belongsTo(() => FriendGroup)
  declare friendGroup: BelongsTo<typeof FriendGroup>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare friendGroupId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare lat: number

  @column()
  declare lng: number

  @column()
  declare streetAddress: string

  @column()
  declare zipCode: string

  @column()
  declare city: string
}
