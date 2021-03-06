import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';




ReactDOM.render(
    <BrowserRouter>
    <Provider store={createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))}>
    <App />
    </Provider>
    </BrowserRouter>,
    document.querySelector('#root')
);