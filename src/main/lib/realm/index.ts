import Realm from 'realm'
import { Users } from './realm.models'

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
  get() {
    this.realm
  }

  addDog() {
    this.realm?.write(() => {
      this.realm?.create('', {
        name: 'test',
        age: 10
      })
    })
  }

  getUsers() {
    return this.realm?.objects<Users>(Users)
  }

  createRecord(object, dataArray) {
    return this.realm?.write(() => {
      dataArray.forEach((data) => {
        this.realm?.create(object, data)
      })
    })
  }

  setupRealm(user: Realm.User) {
    Realm.open({
      schema: [Users],
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
            subs.add(realm.objects(Users))
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
