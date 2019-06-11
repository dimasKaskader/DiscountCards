import React from 'react'
import {render} from 'react-dom'

import { routerReducer } from 'react-router-redux'; //засунуть в редакс, когда разберусь
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import {Link} from 'react-router-dom'

import store from './store'

import App from './App/App'

import MainPage from './MainPage/MainPage'
import Authorization from './authorization/Authorization'
import Registration from './registration/registration'
import Company from './registerCompany/company'
import MyPage from './myPage/MyPage';
import MySale from './mySale/MySale';
import Notifications from './Notifications/Notifications';


// import { syncHistoryWithStore } from 'react-router-redux';
// const history = syncHistoryWithStore(hashHistory, store);

//const store = createStore ();

render(
<Provider store ={store}>
    <BrowserRouter >
        <App>
            <Switch>
                <Route exact path='/' component = { MainPage } />
                <Route path='/authorization' component = { Authorization } />
                <Route path='/registration' component = { Registration } />
                <Route path='/company' component = { Company } />
                <Route path='/page' component ={MyPage} />
                <Route path='/sale' component ={MySale} />
                <Route path='/notifications' component ={Notifications} />
            </Switch>
        </App>
    </BrowserRouter>
</Provider>
, document.getElementById('root'))