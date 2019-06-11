// import React, {Component} from 'react'
import rootReducer from  './redusers/index'
import { createStore, compose } from 'redux';
// import rootReducer from './redusers/index'


const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const configureStore = preloadedState => (
    createStore(
        rootReducer,
        preloadedState,
        composeEnhancers()
    )
);

const store = configureStore({});

export default store;