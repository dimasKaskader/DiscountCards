import React, {Component} from 'react'
import {Link, NavLink} from 'react-router-dom'
import axios from 'axios'
import {User} from '../actions/autorizeUser'
import {Loggin_out} from '../actions/loggin_loggout'
import {Company_state} from '../actions/company'
import {connect} from 'react-redux'

import style from './ControlPanel.module.css'
import cn from "classnames";





class ControlPanel extends Component{

    state = {
        curid: this.props.curid,
        currentTab: '',
        menu_comp_id: 0,
    }

    componentWillMount() {
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
        // this.props.history.push('/');
    }

    logout = (e) => {
        console.log('--logout');
        e.preventDefault();
        axios.get('logout')
            .then(response => {
                console.log( response.data.email ); // 200
                console.log('--logout');
                const { User } = this.props
                User('', '', '')
                const { Loggin_out } = this.props
                Loggin_out( false )
            })
            .catch(error => { console.log( error ); console.log( error.response ) });
        }

        getClassNames(index){
            // console.log('Tab #' + index);
            if (index === 1)
            {   console.log ('жопка')
                document.getElementById('company_cont').style.display = 'block'
            }
            else 
            document.getElementById('company_cont').style.display = 'none'
            this.setState({
                curid: index
            })
            this.props.updateCurid(index)
        }

        getCurrentTab(index, tab) {

            this.setState({
                menu_comp_id: index
            })
            const {Company_state} = this.props
            Company_state(this.props.company.isRegistered, tab)
        }

        componentWillReceiveProps(nextProps) {
            // console.log(nextProps)
            const { curid } = nextProps;
            this.setState({ curid })
            if(!document.getElementById('company_cont') || document.getElementById('company_cont').style.display!='block' )
            {
                this.setState({  menu_comp_id: 0 })
            }
        }

    render() {
        var menu = [
            { name: this.props.user.name, link: '/page' },
            { name: 'Моя компания', link: '/company' },
            { name: 'Мои скидки', link: '/sale' },
            { name: 'Уведомления', link: '/notifications' },
        ]
        var company_menu = [
            { name: 'Общее', tab: 'general'},
            { name: 'Редактировать', tab: 'edit'},
            { name: 'Скидочная карта', tab: 'card'},
            { name: 'Отделения', tab: 'deps'},
            { name: 'Кассиры', tab: 'cashiers'},
            { name: 'Рассылка уведомлений', tab: 'push'},
        ]
        if (this.props.company.isRegistered) {
        var company_cont = company_menu.map((value, index)=>{
            return <li className={index==this.state.menu_comp_id ? style.push:''} key={index} onClick={this.getCurrentTab.bind(this, index, value.tab)}>{value.name}</li>
        })
        }
        
        var object =  menu.map((value, index)=>{
            return  <li  key={index} >
                        <NavLink className={index==this.state.curid?style.push:''} to={value.link} activeClassName={style.push} onClick={this.getClassNames.bind(this, index)}>{value.name}</NavLink>
                        { (value.name === 'Моя компания') &&
                        <ul id = 'company_cont' style={this.props.company.currentTab?{display: 'block'}:{display: 'none'}}>
                            {company_cont}
                        </ul>
                        }
                    </li>
                    
        })

        // var company_cont = <ul>
        //     <li  onClick={e => this.setState({currentTab: "general"})}>Общее</li>
        //     <li  onClick={e => this.setState({currentTab: "edit"})}>Редактировать</li>
        //     <li  onClick={e => this.setState({currentTab: "deps"})}>Отделения</li>
        //     <li  onClick={e => this.setState({currentTab: "cashiers"})}>Кассиры</li>
        // </ul>
        

        return (
            <div id="ControlPanel" className = { style.conteiner } >
                    { !this.props.init.loggedIn &&
                        <div>
                            <div className = { cn( style.controll_Button, style.auth ) } >
                                <Link to='/authorization'>войти</Link>
                            </div>
                            <div className = { cn(style.controll_Button, style.reg)}>
                                <Link to='/registration'>зарегистрироваться</Link>
                            </div>
                        </div>
                    }
                    { this.props.init.loggedIn &&
                        <div>
                            <ul className={ style.usersContol }>
                            {object}
                            </ul>
                            <div className = { cn( style.controll_Button, style.reg, style.logout) } style = {{ background: 'rgb(112, 184, 111)'}}>
                                <a onClick={this.logout}> выход </a>
                            </div>
                        </div>
                    }
            </div>
        )
    }
}
 

export default connect (state => ({
    init: state.init,
    user: state.user || '',
    company: state.company
}),{User, Loggin_out, Company_state})(ControlPanel);