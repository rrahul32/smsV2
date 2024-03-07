import { Payments, Students, Users } from '@shared/realm'
import Realm from 'realm'

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
  getObjects<T>(objectName: string) {
    return this.realm?.objects<T>(objectName)
  }

  addObject<T, V>(objectName: string, values) {
    return this.realm?.write<V>(() => {
      const res = this.realm?.create<T>(objectName, values)
      return res?.toJSON() as V
    })
  }

  updateObject<T>(objectName: string, id, values) {
    return this.realm?.write<boolean>(() => {
      const object = this.realm?.objectForPrimaryKey<T>(objectName, id)
      if (object) {
        Object.entries(values).forEach(([key, value]) => {
          object[key] = value
        })
        return true
      } else {
        return false
      }
    })
  }

  addObjects<T, V>(objectName: string, valuesArray) {
    return this.realm?.write<V[]>(() => {
      return valuesArray.map((values) => {
        const res = this.realm?.create<T>(objectName, values)
        return res?.toJSON() as V
      })
    })
  }

  setupRealm(user: Realm.User) {
    Realm.open({
      schema: [Users, Students, Payments],
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
            subs.add(realm.objects(Students))
            subs.add(realm.objects(Payments))
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
