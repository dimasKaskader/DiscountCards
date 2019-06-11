import React, {Component} from 'react'
import {User} from '../../actions/autorizeUser'
import {connect} from 'react-redux'
import style from './about.module.css'


class About extends Component{
    render() {
        return(
            <div className ={style.conteiner} style= {{fontSize :'35px', cursor:'default'}}>
                {this.props.user.name}
                <p>Город</p>
                <p>ОбЩий рейтинг</p>
                <p>Кол-во бонусов</p>
            </div>
        )
    }
}
export default connect (state => ({
    user: state.user || ''
}),{User})(About);