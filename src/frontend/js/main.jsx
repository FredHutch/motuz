import React from 'react'
import ReactDOM from 'react-dom';

import {createBrowserHistory} from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react'

import Root from 'Root.jsx'
import configureStore from 'store.jsx';

const history = createBrowserHistory();
const {store, persistor} = configureStore(history);

ReactDOM.render((
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Root />
        </PersistGate>
    </Provider>
), document.getElementById("container"));
