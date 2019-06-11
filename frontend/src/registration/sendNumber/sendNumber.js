import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import styles from "./sendNumber.module.css";
// import AddInformation from '../registration'
import Confirmation from '../confirmation/confirmation'

class SendNumber extends Component {
    state = {
        telNumber: '',
        confirmation: false,
    }
    handlePassChange = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '')
        this.setState({
            telNumber: e.target.value
        })
    }

    send = () => {
        this.setState({
            confirmation: !this.state.confirmation
        })
    }

    render() {
        const {telNumber, confirmation} = this.state
        console.log(this.props)
        const {openForm} = this.props
        return(
            <div>
                { !confirmation &&
                <div className={ styles.form }>
                    <div className={ styles.confirmBody }>
                        Введите номер телефона
                        <br />
                        к которому привязано
                        <br />
                        ваше приложение
                        <br />
                        в это поле:
                        <div className={ styles.confPass_conteiner }>
                            <label>+7</label>
                            <input className={styles.confPass} type="text" name="confPass1" maxLength='10' onChange={this.handlePassChange} autoFocus value={telNumber} />
                            {/* <input className="confPass" type="text" name="confPass2" maxLength='1' onChange={this.handlePassChange} />
                            <input className="confPass" type="text" name="confPass3" maxLength='1' onChange={this.handlePassChange} />
                            <input className="confPass" type="text" name="confPass4" maxLength='1' onChange={this.handlePassChange} /> */}
                        </div>
                    </div>
                    <div className={styles.border}>
                        <input className="button" type="submit" name="submit" value="отправить" onClick={this.send} />
                    </div>
                    <div className={styles.link}>
                        <a onClick = {openForm}>назад</a>
                    </div>
                </div>
                }
                { confirmation &&
                    <Confirmation text='уведомление с кодом на ваш мобильник' />
                }
            </div>
        )
    }
}

export default SendNumber


 