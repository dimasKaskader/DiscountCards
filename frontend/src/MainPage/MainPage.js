import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {User} from '../actions/autorizeUser'
import {Loggin_out} from '../actions/loggin_loggout'
import {connect} from 'react-redux'


class MainPage extends Component{

    logout = (e) => {
        e.preventDefault();
        axios.get('logout')
            .then(response => {
                console.log(response.data.email); // 200
                console.log('--logout');
                //накодить сохранинение информации в store
                const {User} = this.props
                User('','','')
                const {Loggin_out} = this.props
                Loggin_out(false)
            })
            .catch(error => {console.log(error); console.log(error.response)});

        }

    render() {
        return(
            <div>
                <h1>Главная</h1>
                {/* <ul>
                    { !this.props.init.loggedIn &&
                        <div>
                            <li><Link to='/authorization'>авторизация</Link></li>
                            <li><Link to='/registration'>регистрация</Link></li>
                        </div>
                    }
                    { this.props.init.loggedIn &&
                        <li><button onClick={this.logout} >Выход</button></li>
                    }
                    <li><Link to='/registerCompany'>регистрация компании</Link></li>
                </ul> */}
            </div>
        )
    }
}
 

export default connect (state => ({
    init: state.init
}),{User, Loggin_out})( MainPage);
