import * as SecureStore from 'expo-secure-store'

class Store {
  getItem(key: string) {
    return SecureStore.getItemAsync(key)
  }

  removeItem(key: string) {
    return SecureStore.deleteItemAsync(key)
  }

  setItem(key: string, value: string) {
    return SecureStore.setItemAsync(key, value)
  }
}

export const store = new Store()
