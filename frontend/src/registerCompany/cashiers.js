import React, {Component} from 'react'
import styles from "./cashiers.module.css"
const axios = require('axios');

class Cashier extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        var inputs
        if (this.props.cashier.isEditable || this.props.cashier.isNew)
        {
            inputs = <input value={this.props.cashier.phone} onChange={(e) => this.props.handler(e, this.props.index)} className={styles.phone} placeholder={"Телефон"}/>
        }
        else
        {
            inputs = <label className={styles.phone}>{'+' + this.props.cashier.phone.toString()}</label>
        }
        var name = null
        var message = this.props.cashier.error
        var message_color
        if (this.props.cashier.is_confirmed === false)
        {
            message = 'Требуется подтверждение пользователя'
            message_color = 'red'
        }
        else if (this.props.cashier.is_confirmed === true)
        {
            name = this.props.cashier.first_name + ' ' + this.props.cashier.last_name
            message = 'Подтверждено'
            message_color= 'green'
        }
        return(
            <li className={styles.cashier}>
                {(this.props.index + 1).toString()}
                {inputs}
                <label className={styles.name}>{name}</label>
                <label className={styles.notConfirmed} style={{color: message_color}}>{message}</label>
                
                <img src="/static/images/delete.svg" className={styles.deleteImg} onClick={e => this.props.deleteCashier(e, this.props.index)}/>
            </li>
        )
    }
}

class Cashiers extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cashiers: []
        }

        this.addCashier = this.addCashier.bind(this);
        this.phoneInput = this.phoneInput.bind(this);
        this.getCashiers = this.getCashiers.bind(this);
        this.deleteCashier = this.deleteCashier.bind(this);
        this.getCashiers()
    }

    getCashiers() {
        axios.get('cashiers')
        .then((response) => {
            this.setState({cashiers: response.data})
        })
        .catch(error => {
            console.log(error)
        })
    }

    phoneInput(e, index) {
        var cashiers = this.state.cashiers.slice()
        cashiers[index].phone = e.target.value
        
        axios.post('cashiers', cashiers[index])
        .then((response) => {
            cashiers[index] = response.data
            cashiers[index].isEditable = false
            this.setState({cashiers})
        })
        .catch(error => {
            cashiers[index].error = error.response.data.error_message
            this.setState({cashiers})
        })
        this.setState({cashiers})
    }

    addCashier() {
        var cashiers = this.state.cashiers
        var id = (cashiers.length > 0) ? cashiers[cashiers.length-1].id + 1 : 0 
        this.setState({
            cashiers: cashiers.concat([{
                isNew: true,
                id: id,
                phone: ''
            }])
        })
    }

    deleteCashier(e, index) {
        var cashiers = this.state.cashiers
        var deleted = cashiers.splice(index,1)
        if(!deleted[0].isNew)
            axios.delete('cashiers?id=' + deleted[0].id.toString())
            .then((response) => {
                console.log(response)
            })
            .catch(error => {
                console.log(error);
            })

        this.setState({
            cashiers
        })
    }

    render() {
        //console.log(this.props)
        const cashiers = this.state.cashiers.map((cashier, index) => 
            <Cashier key={cashier.id} cashier={cashier} handler={this.phoneInput} index={index} deleteCashier={this.deleteCashier}></Cashier>
        )
        
        return(
            <div className={styles.cashier_conteiner}>
                <div style = {{ margin: '0 auto', width:'600px', position: 'relative'}} className={this.props.style}>
                    <ul className={styles.depUl}>
                    {cashiers}
                    </ul>
                    <div className={styles.addCashier} onClick={this.addCashier}>
                        <img className={styles.addImg} src="/static/images/add-button.svg" alt="arrow"/>
                        Добавить кассира
                    </div>
                </div>
            </div>
        )
    }
}

export default Cashiers

