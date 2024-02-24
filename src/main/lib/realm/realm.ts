import { configDotenv } from 'dotenv'
import Realm from 'realm'
import { Dog, Item } from './realm.model'

//load env values to process.env
configDotenv()

export const test = async (user) => {
  const realm = await Realm.open({
    schema: [Item, Dog],
    sync: user
      ? {
          user,
          flexible: true,
          initialSubscriptions: {
            update: (subs, realm) => {
              subs.add(realm.objects('Dog'))
              subs.add(realm.objects('Item'))
            },
            rerunOnOpen: true
          }
        }
      : undefined
  }).catch((e) => {
    console.log('🚀 ~ test ~ e:', e)
  })
  if (realm) {
    realm.write(() => {
      const dog = realm.create(Dog, {
        name: 'test',
        age: 10
      })
    })
    const items = realm.objects(Dog)
    console.log('🚀 ~ test ~ items:', items)
  }
}
