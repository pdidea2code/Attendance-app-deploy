import { createStore } from 'redux'
import rootReducer from '../root/rootReducer'

const store = createStore(rootReducer)
export default store

// import { configureStore } from '@reduxjs/toolkit'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import rootReducer from '../root/rootReducer'

// const persistConfig = {
//   key: 'root',
//   storage,
//   debug: true,
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// })

// const persistor = persistStore(store)

// export { store, persistor }

// import { createStore } from 'redux'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import rootReducer from '../root/rootReducer'

// const persistConfig = {
//   key: 'root',
//   storage: storage,
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// const store = createStore(persistedReducer)
// const persistor = persistStore(store)

// export { store, persistor }
