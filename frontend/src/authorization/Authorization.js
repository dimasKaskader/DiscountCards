import React, {Component} from 'react'
import axios from 'axios'
// import './Authorization.css'
import styles from "./Authorization.module.css";
import Confirmation from '../registration/confirmation/confirmation'
// import SendNumber from './sendNumber/sendNumber'
import { Link } from 'react-router-dom'
import SendNumber from '../registration/sendNumber/sendNumber'
import {connect} from 'react-redux'
import {User} from '../actions/autorizeUser'
import {Loggin_out} from '../actions/loggin_loggout'

class Authorization extends Component{
    state = {
        errorMessEmail:'',
        errorMessPass:'',
        email: '',
        password: '',
        confirmationEmail: true,
        sendNumber: true,
    }


    handleEmailChange = ({ target: {value} }) => {
        this.setState({
            email: value
        })
        document.getElementById('email').style.backgroundColor="rgba(255,255,255,0.92)"
        this.setState({
            errorMessEmail : ''
        })
    }

    handlePassChange = ({ target: {value} }) => {
        this.setState({
            password: value
        })
        document.getElementById('password').style.backgroundColor="rgba(255,255,255,0.92)"
        this.setState({
            errorMessPass : ''
        })
    }

    Authorize = (e) => {
        e.preventDefault();
        const { email, password } = this.state
     
        if (email && password) 
        {
            axios.post('login', {
                email: email,
                password: password,
                phone_number: ''
            })
            .then(response => {
                console.log('--post'); // 200
                console.log(response);
                axios.get('login')   //возварщает, только почту 
                .then(response => {
                    console.log(response.data); // 200
                    console.log('--getR');
                    //накодить сохранинение информации в store
                    const {Loggin_out} = this.props
                    Loggin_out(true)
                    const {User} = this.props
                    User(response.data.name||response.data.email,response.data.email)
                })
                .catch(error => {console.log(error); console.log(error.response)});
                this.props.history.push('/');
            })
            .catch(error => {console.log(error); console.log(error.response);
                this.setState({
                    errorMessEmail:'кажется, вы ошиблись',
                    errorMessPass:'кажется, вы ошиблись',
                });
                document.getElementById('email').style.backgroundColor="rgba(255, 179, 179,0.88)";
                document.getElementById('password').style.backgroundColor="rgba(255, 179, 179,0.88)"
            });
            
        }
        if(!email)
        {
            document.getElementById('email').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.setState({
                errorMessEmail : 'Поле не может быть пустым'
            })
        }
        if(!password)
        {
            document.getElementById('password').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.setState({
                errorMessPass : 'Поле не может быть пустым'
            })
        }
        
    }
    openForm =() =>{
        this.setState({
            sendNumber : !this.state.sendNumber
        })
    }

    render() {
    const {errorMessPass, errorMessEmail, email, password, confirmationEmail, sendNumber} = this.state
    //const back = Link.to('/')
    const errorUser =  errorMessEmail && <div id="error" className={styles.error} data-title={errorMessEmail}></div>
    const errorPass =  errorMessPass && <div id="error" className={styles.error} data-title={errorMessPass}></div>

        return(
            <div className={styles.background}>
            { sendNumber &&
                <form method="post">
                    <div className={styles.form}>
                        <br />
                        <input id="email" type="text" name="email" placeholder="Электронная почта или номер телефона" value={email} onChange={this.handleEmailChange} />
                        {errorUser}
                        <input id="password" type="password" name="password" placeholder="Пароль" value={password} onChange={this.handlePassChange} />
                        {errorPass}
                        <div className={styles.border}>
                            <input className={styles.button}  type="submit" name="enter" value="войти" onClick={this.Authorize} />
                        </div>
                        <div className={styles.link}>
                            <a onClick = {this.openForm}>Есть аккаунт в мобильном приложении</a>
                            {/* <br />
                            <Link exact to='/registration'>Зарегистрироваться</Link> */}
                        </div>
                    </div>
                </form>
            }
            { !sendNumber &&
                <SendNumber openForm={this.openForm} />
            }
            </div>
        )
    }
}

export default connect (state => ({
    state: state
}), {User, Loggin_out})(Authorization);