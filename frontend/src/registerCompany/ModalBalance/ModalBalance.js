import React, {Component} from 'react'
import style from './modal.module.css'
const axios = require('axios');

class ModalBalance extends Component{
  constructor(props) {
    super(props);  
    this.state = {
          balance: '',
    }
    this.postBalance = this.postBalance.bind(this);
  }
    postBalance() {
      axios.post('balance_payment', {payment: this.state.balance})
      .then(response => {
        //console.log(response.data);
        this.props.onClose(response.data)
      })
      .catch(error => {
          console.log(error);
      })
    }
    render() {
        if (this.props.isOpen === false)
          return null
  
        return (
          <div>
            <div className={style.modal}>
                <h3 style={{cursor: 'default'}}>Пополнение баланса</h3>
                <h5 style={{margin:'5px 0', cursor: 'default'}} >Введите сумму пополнения</h5>
                <input className={style.input_balance} onChange={this.handleBalanceChange} autoFocus value={this.state.balance}/>
                <div className={style.sub} onClick={this.postBalance}>Оплатить</div>
            </div>
            <div id='bg' className={style.bg} onClick={e => this.close(e)}/>
          </div>
        )
      }
      
      handleBalanceChange = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '')
        this.setState({
            balance: e.target.value
        })
    }
      close(e) {
        e.preventDefault()
  
        if (this.props.onClose) {
          this.props.onClose()
        }
      }
}

export default ModalBalance