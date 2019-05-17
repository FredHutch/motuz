import storage from 'redux-persist/es/storage';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { routerMiddleware } from 'connected-react-router';
import getRootReducer from 'reducers/reducers.jsx';

export default (history) => {
    const rootReducer = getRootReducer(history)

    const persistedReducer = persistReducer({
        key: 'polls',
        storage: storage,
        // whitelist: ['nameOfAReducer'],
    }, rootReducer);

    const store = createStore(
        persistedReducer,
        {},
        compose(
            applyMiddleware(
                routerMiddleware(history)
            )
        )
    );

    const persistor = persistStore(store);

    return {store, persistor};
};