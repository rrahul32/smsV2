import Realm from 'realm'
import { Dog, Item } from './realm.model'

export class Database {
  private app: Realm.App
  private apiKey: string
  private appId: string
  private realm: Realm | null = null
  private isOnline = false

  constructor() {
    this.apiKey = import.meta.env.MAIN_ATLAS_API_KEY
    this.appId = import.meta.env.MAIN_ATLAS_APP_ID
    this.app = new Realm.App({
      id: this.appId
    })
    this.connect()
  }
  async tryLogin() {
    const credentials = Realm.Credentials.apiKey(this.apiKey)
    return this.app
      .logIn(credentials)
      .then(() => {
        this.isOnline = true
        return true
      })
      .catch((e) => {
        console.log('🚀 ~ returnapp.logIn ~ e:', e?.message)
        return false
      })
  }

  test() {
    if (this.realm) {
      console.log(
        '🚀 ~ Database ~ reconnect ~ his.realm?.syncSession?.connectionState:',
        this.realm?.syncSession?.connectionState
      )
      const items = this.realm.objects(Dog)
      console.log('🚀 ~ test ~ items:', items.length)
    } else {
      console.log('Realm connection not found')
    }
  }

  addDog() {
    this.realm?.write(() => {
      this.realm?.create(Dog, {
        name: 'test',
        age: 10
      })
    })
  }

  setupRealm(user: Realm.User) {
    Realm.open({
      schema: [Item, Dog],
      sync: {
        user,
        flexible: true,
        newRealmFileBehavior: {
          type: Realm.OpenRealmBehaviorType.DownloadBeforeOpen
        },
        existingRealmFileBehavior: {
          type: Realm.OpenRealmBehaviorType.OpenImmediately
        },
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(realm.objects(Dog))
            subs.add(realm.objects(Item))
          },
          rerunOnOpen: true
        }
      }
    })
      .then((realm) => {
        this.realm = realm
        this.realm.syncSession?.addConnectionNotification(() => {
          console.log('Connection Established')
        })
      })
      .catch((e) => {
        console.log('🚀 ~ test ~ e:', e)
      })
  }

  async connect() {
    await this.tryLogin()
    const users = Object.values(this.app.allUsers)
    const user = this.app.currentUser ?? users[users.length - 1]
    this.setupRealm(user)
  }

  async reconnect() {
    if (!this.isOnline) {
      const maxRetries = 100
      let retryCount = 1
      while (!this.isOnline && retryCount <= maxRetries) {
        await this.tryLogin()
        retryCount++
      }
      if (retryCount > maxRetries) {
        throw new Error('Max retries reached')
      }
      this.realm?.close()
      this.connect()
    }
    return true
  }
}
