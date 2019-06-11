import React, { Component } from 'react'
import axios from 'axios'
import style from  './registration.module.css'
import Confirmation from './confirmation/confirmation'
import AddInformation from './addInformation/addInformation'

import {connect} from 'react-redux'
import {User} from '../actions/autorizeUser'
import {Loggin_out} from '../actions/loggin_loggout'



class Registration extends Component{
    state = {
        errorMessEmail:'',
        errorMessPass:'',
        errorMessPass2:'',
        errorMessName: '',
        errorMessSurename: '',
        email: '',
        surname: '',
        name: '',
        password: '',
        password2: '',
        confirmationEmail: true,
    }

    handleEmailChange = ({ target: {value} }) => {
        this.setState({
            email: value
        })
        document.getElementById('email').style.backgroundColor="rgba(255,255,255,0.82)"
        this.setState({
            errorMessEmail : ''
        })
    }

    handlePassChange = ({ target: {value} }) => {
        this.setState({
            password: value
        })
        if ( value !== this.state.password2 && value !== '' && this.state.password2 !== ''){
            console.log('--true')
            document.getElementById('password2').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.state.errorMessPass2 = 'Пароли отличаются'
        } else {
            console.log('--else'+value !== this.state.password2 )
            document.getElementById('password2').style.backgroundColor="rgba(255,255,255,0.82)"
            this.setState({
                errorMessPass2 : ''
            })
        }
        document.getElementById('password').style.backgroundColor="rgba(255,255,255,0.82)"
        this.setState({
            errorMessPass : ''
        })
    }

    handlePass2Change = ({ target: {value} }) => {
        this.setState({
            password2: value
        })
        document.getElementById('password').style.backgroundColor="rgba(255,255,255,0.82)"
        this.state.errorMessPass = ''
        if (value !== this.state.password && value !== '') {
            this.state.errorMessPass2 = 'Пароли отличаются'
            document.getElementById('password2').style.backgroundColor="rgba(255, 179, 179,0.88)"
        }
        else {
            this.state.errorMessPass2 = ''
            document.getElementById('password2').style.backgroundColor="rgba(255,255,255,0.82)"
        }
        // this.state.errorMessPass2 = value != this.state.password ? 'Пароли отличаются' : ''
    }

    handleNameChange = ({ target: {value} }) => {
        value = value.replace(/\d/g, '')
        this.setState({
            name: value
        })
        document.getElementById('name').style.backgroundColor="rgba(255,255,255,0.82)"
        this.setState({
            errorMessName : ''
        })
    }

    handleSurnameChange = ({ target: {value} }) => {
        value = value.replace(/\d/g, '')
        this.setState({
            surname: value
        })
        document.getElementById('surname').style.backgroundColor="rgba(255,255,255,0.82)"
        this.setState({
            errorMessSurename : ''
        })
    }

    sendRegistration = (e) => {
        e.preventDefault();
        const { email, password, password2, name, surname} = this.state
     
        if ( email && password && password2 && name && surname ) 
        {
            axios.post('register', {
                email: email,
                password: password,
            })
            .then(response => {
                console.log(response); // 200
                axios.put('users', {
                    name: name,
                    surname: surname
                }) .then(response =>{
                    const {Loggin_out} = this.props
                    Loggin_out(true)
                    const {User} = this.props  //надо отпралять юзера в базу
                    User(name+surname, email, password)
                    this.props.history.push('/');
                })
                this.setState({
                    confirmationEmail : false,
                })  
            })
            .catch(error => {console.log(error); console.log(error.response);            
                this.setState({
                errorMessEmail: 'эта почта занята'
            });
            document.getElementById('email').style.backgroundColor="rgba(255, 179, 179,0.88) !important"
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
        if(!password2)
        {
            document.getElementById('password2').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.setState({
                errorMessPass2 : 'Поле не может быть пустым'
            })
        }
        if(!name)
        {

            document.getElementById('name').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.setState({
                errorMessName : 'Поле не может быть пустым'
            })
        }
        if(!surname)
        {
            document.getElementById('surname').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.setState({
                errorMessSurename : 'Поле не может быть пустым'
            })
        }
    }

    render() {
    const {errorMessPass, errorMessPass2, errorMessEmail, errorMessSurename, errorMessName, email, surname, name, password, password2, confirmationEmail} = this.state
    //const back = Link.to('/')
    const errorUser =  errorMessEmail && <div id="error" className={style.error} data-title={errorMessEmail}></div>
    const errorPass =  errorMessPass && <div id="error" className={style.error} data-title={errorMessPass}></div>
    const errorPass2 =  errorMessPass2 && <div id="error" className={style.error} data-title={errorMessPass2}></div>
    const errorName =  errorMessName && <div id="error" className={style.error} data-title={errorMessName}></div>
    const errorSurname =  errorMessSurename && <div id="error" className={style.error} data-title={errorMessSurename}></div>
        return(
            <div className={style.background}>
            { confirmationEmail &&
                <form method="post">
                    <div className={style.form}>
                        <br />
                        <input id="email" type="text" name="email" placeholder="Электронная почта" value={email} onChange={this.handleEmailChange} />
                        {errorUser}
                        {/* this.state.errorMessUser && <div id="error" className="error" data-title="вставить текст ошибки"></div> */}
                        <input id="name" type="text" name="name" placeholder="Имя" value={name} onChange={this.handleNameChange} />
                        {errorName}
                        <input id="surname" type="text" name="surname" placeholder="Фамилия" value={surname} onChange={this.handleSurnameChange} />
                        {errorSurname}
                        <input id="password" type="password" name="password" placeholder="Придумайте пароль" value={password} onChange={this.handlePassChange} />
                        {errorPass}
                        <input id="password2" type="password" name="password2" placeholder="Повторите пароль" value={password2} onChange={this.handlePass2Change} />
                        {/* <div id="error" className="error" data-title="errorMessPass"></div> */}
                        {errorPass2}
                        <div className={style.border}>
                            <input className={style.button}  type="submit" name="register" value="зарегистрироваться" onClick={this.sendRegistration} />
                        </div>
                    </div>
                </form>
            }
            { !confirmationEmail &&
                <Confirmation text='письмо с кодом
                на указанную вами почту,' />
                // <AddInformation users = {{email, password }} history = {this.props.history} />
            }
            </div>
        )
    }
}

export default connect (state => ({
}),{User, Loggin_out})(Registration);
