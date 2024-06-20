import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import FriendGroup from '#models/friend_group'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @manyToMany(() => FriendGroup)
  declare friendGroups: ManyToMany<typeof FriendGroup>

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @column()
  declare email: string

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare streetAddress: string

  @column()
  declare city: string

  @column()
  declare zipCode: string

  @column()
  declare country: string

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 day',
  })
}
