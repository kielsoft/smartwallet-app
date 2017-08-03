import * as _ from 'lodash'
import EventEmitter from 'events'

export default class AuthService extends EventEmitter {
  constructor(backend) {
    super()
    this.backend = backend
    this.currentUser = null
    this._localStorage = localStorage

    if (typeof localStorage !== 'undefined') {
      const savedSession = localStorage.getItem('jolocom.identity')
      if (savedSession) {
        this._setCurrentUser({
          wallet: new Wallet({
            ...JSON.parse(savedSession),
            gateway: this.backend
          })
        })
      }
    }
  }

  async login({seedPhrase, pin}) {
    const res = await this.backend.login({seedPhrase, pin})
    const walletConfig = {
      seedPhrase, userName: (await res.json()).userName
    }

    this._localStorage.setItem('jolocom.identity', JSON.stringify(walletConfig))
    this._setCurrentUser({
      wallet: new Wallet({
        ...walletConfig,
        gateway: this.backend
      })
    })
  }

  register({userName, seedPhrase}) {
    return this.backend.register({userName, seedPhrase})
  }

  _setCurrentUser(user) {
    this.currentUser = user
    this.emit('changed', user)
  }
}

export class Wallet {
  constructor({gateway, userName, seedPhrase}) {
    this._gateway = gateway
    this.userName = userName
    this.identityURL = `https://identity.jolocom.com/${userName}`
    this.seedPhrase = seedPhrase
  }

  async getUserInformation() {
    try {
      const [email, phone, passport, idcard] =
        await this._gateway.getOwnAttributes({
          userName: this.userName,
          type: ['email', 'phone', 'passport', 'idcard'],
          checkVerified: true
        })

      return {
        webId: `https://${this.userName}.webid.jolocom.de/profile/card#me`,
        userName: this.userName,
        contact: {
          email: email.map(email => ({
            address: email.contents.value,
            verified: email.verfied,
            savedToBlockchain: false
          })),
          phone: phone.map(phone => ({
            type: phone.content.type,
            number: phone.contents.value,
            verified: phone.verified,
            savedToBlockchain: false
          }))
        },
        passports: passport.map(passport => ({
          ..._.fromPairs(passport.contents),
          verified: passport.verified,
          savedToBlockchain: false
        })),
        idCards: idcard.map(idcard => ({
          ..._.fromPairs(idcard.contents),
          verified: idcard.verified,
          savedToBlockchain: false
        }))
      }
    } catch (e) {
      console.error(e)
      console.trace()
      throw e
    }
  }
}
