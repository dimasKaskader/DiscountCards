import React, { Component } from 'react'
import AddInformation from '../addInformation/addInformation'
import style from './confirmation.module.css'


class Confirmation extends Component{
    state = {
        emailConfirmation: '',
        nextPage: false,
    }

    handlePassChange = (e) => {
        // console.log("----", e.next )
        e.target.value = e.target.value.replace(/\D/g, '')
        this.setState({
            emailConfirmation: e.target.value
        })
    }

    send = (e) => {
        e.preventDefault();
        this.setState({
            nextPage: !this.state.nextPage
        })
        console.log("----", this.state.nextPage )
    }

    render() {
        const {emailConfirmation, nextPage} = this.state
        const {text} = this.props
        return(
            <div>
                {!nextPage &&
                <div className={style.form}>
                    <div className={style.confirmBody}>
                        Мы
                        <br />
                        выслали {text}
                        <br />
                        пожалуйста введите его
                        <br />
                        в это поле:
                        <div className={style.confPass_conteiner}>
                            <input className={style.confPass} type="text" name="confPass1" maxLength='4' onChange={this.handlePassChange} autoFocus value={emailConfirmation} autoComplete="off" />
                            {/* <input className="confPass" type="text" name="confPass2" maxLength='1' onChange={this.handlePassChange} />
                            <input className="confPass" type="text" name="confPass3" maxLength='1' onChange={this.handlePassChange} />
                            <input className="confPass" type="text" name="confPass4" maxLength='1' onChange={this.handlePassChange} /> */}
                        </div>
                    </div>
                    <div className={style.border}>
                        <input className={style.button} type="submit" name="register" value="отправить" onClick={this.send} />
                    </div>
                </div>
                }
                { nextPage &&
                    <AddInformation />
                }
            </div>
        )
    }
}

export default Confirmation