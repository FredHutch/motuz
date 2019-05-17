import storage from 'redux-persist/es/storage';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import rootReducer from 'reducers/reducers.jsx';

export default (history) => {
    const persistedReducer = persistReducer({
        key: 'polls',
        storage: storage,
        // whitelist: ['nameOfAReducer'],
    }, rootReducer);

    const routerReducer = connectRouter(history)(persistedReducer)

    const store = createStore(
        routerReducer,
        {},
        applyMiddleware(
            routerMiddleware(history)
        )
    );

    const persistor = persistStore(store);

    return {store, persistor};
};