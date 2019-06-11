import React, {Component} from 'react'
import styles from "./addInformation.module.css";
import axios from 'axios'

import {connect} from 'react-redux'
import {User} from '../../actions/autorizeUser'
import {Loggin_out} from '../../actions/loggin_loggout'

class AddInformation extends Component{
    state = {
        name: '',
        surname: '',
        errorMessSurname: '',
        errorMessName: ''
    }

    handleNameChange = ({ target: {value} }) => {
        value = value.replace(/\d/g, '')
        this.setState({
            name: value
        })
        document.getElementById('name').style.backgroundColor="rgba(0,0,0,0.05);"
        this.setState({
            errorMessName : ''
        })
    }

    handleSurnameChange = ({ target: {value} }) => {
        value = value.replace(/\d/g, '')
        this.setState({
            surname: value
        })
        document.getElementById('surname').style.backgroundColor="rgba(0,0,0,0.05);"
        this.setState({
            errorMessSurname : ''
        })
    }

    send = (e) => {
        e.preventDefault();
        const { name, surname, errorMessSurname, errorMessName} = this.state
        const { users } = this.props
        console.log (this.props)
        if (name && users.password && surname && users.email) {

            axios.post('register', {
                email: users.email,
                password: users.password
            })
            .then(response => {
                console.log(response); // 200
                const {Loggin_out} = this.props
                Loggin_out(true)
                const {User} = this.props  //надо отпралять юзера в базу
                User(name+surname, users.email, users.password)
                this.props.history.push('/');
            })
            .catch(error => {console.log(error); console.log(error.response)});
        }
        if (!name) {
            document.getElementById('name').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.setState({
                errorMessName : 'Поле не может быть пустым'
            })
        }
        if (!surname) {
            document.getElementById('surname').style.backgroundColor="rgba(255, 179, 179,0.88)"
            this.setState({
                errorMessSurname : 'Поле не может быть пустым'
            })
        }
    }

    render() {
        const {name, surname, errorMessName, errorMessSurname} = this.state
        const errorName =  errorMessName && <div id="error" className={styles.error} data-title={errorMessName}></div>
        const errorSurname = errorMessSurname && <div id="error" className={styles.error} data-title={errorMessSurname}></div>
        return(
            <div className={styles.form}>
                <div className={styles.AddBlockBody}>
                    <h3>Добавьте информацию о себе:</h3>
                    <label>Имя:</label>
                    <input className={styles.name} id="name" type="text" name="name"  value={name} onChange={this.handleNameChange} />
                    {errorName}
                    <label>Фамилия:</label>
                    <input className={styles.surname} id="surname" type="text" name="surname"  value={surname} onChange={this.handleSurnameChange} />
                    {errorSurname}
                </div>
                <div className={styles.border}>
                    <input className="button" type="submit" name="confirm" value="Подтвердить" onClick={this.send} />
                </div>
            </div>
        )
    }
}

export default connect (state => ({
}),{User, Loggin_out})(AddInformation);

// export default AddInformation