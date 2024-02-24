import { App, Credentials } from 'realm'

export class Database {
  private user
  private apiKey: string
  private appId: string
  constructor() {
    this.apiKey = process.env.ATLAS_APP_ID as string
    this.appId = process.env.ATLAS_API_KEY as string
    this.tryLogin()
  }
  async tryLogin() {
    const app = new App({ id: this.appId })
    const credentials = Credentials.apiKey(this.apiKey)
    app
      .logIn(credentials)
      .then((user) => {
        this.user = user
      })
      .catch((e) => {
        console.log('🚀 ~ returnapp.logIn ~ e:', e?.message)
      })
  }
}
