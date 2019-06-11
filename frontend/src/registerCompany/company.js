import React, {Component} from 'react'
import styles from "./company.module.css"
import AddDepartments from "./addDepartments.js"
import RegisterCompany from "./registerCompany.js"
import Cashiers from "./cashiers.js"
import Graf from './graf';

import {connect} from 'react-redux'
import {Company_state} from '../actions/company'
import Table from './table/table';
import Push from './push';
import ModalBalance from './ModalBalance/ModalBalance'
import Card from './card/card'
import Weekend_sales from './weekend sales/Weekend_sales';

const axios = require('axios');


var data = [
    ['5%', 15, '2018-02-31', 5000000050500000040001434],
    ['10%', 127, '2018-02-18', 200],
    ['13%', 48, '2017-03-16', 800],
  ]

// function getData(){
//     axios.get('push_notifications')
//     .then(response => {
//         console.log('notifications', response.data)
//         var data = response.data 
//         return data
//     })
//     .catch(error => {
//         console.log(error);
//     })

// }
// data = getData()


class CompanyGeneral extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            grafSort:'week',
            salesData: [{}]
        }
        this.getCompanyHistoryPurchases(this.state.grafSort)
    }

    getCompanyHistoryPurchases(a) {
        axios.get('company_history_purchases?period=' + a)
        .then(response => {
            if(response.data.length > 0)
            this.setState({salesData: response.data})
        })
        .catch(error => {
            console.log(error);
        })
    }

    change_grafSort = (a) => {
        this.setState({
            grafSort : a  
        })
        this.getCompanyHistoryPurchases(a)
    }
    // console.log('data', data)
    render() {
    return(
        <div className={styles.general_conteiner}>
        <div style = {{ margin: '0 auto', width:'600px', position: 'relative', height: '250px'}}>
            <label className={styles.title}>
                {this.props.title}
            </label>
            <br />
            <label className={styles.industry}>
                {this.props.industry}
            </label>

            <img className={styles.logo} src={this.props.logo}/>
            <label className={styles.description}>
                {this.props.description}
            </label>
        <div className={styles.balance} style = {{top:'180px', width:'200px', position: 'relative', textAlign:'center'}}>
        <label style ={{lineHeight: '33px', fontSize: '15px', lineHeight: '15px'}}>
                    {this.props.balance} баллов
                </label>
            <div style = {{margin:'7px auto', width:'120px', }}>
                <div className = {styles.balance_sub} onClick={() => this.props.openModal()}>пополнить</div>
            </div>
        </div>
        </div>

            {/* <div style={{position:'relative', position: 'relative', margin: '0 auto 25px', maxWidth: '1115px', width: '90%'}}><Graf data={props.data}></Graf></div> */}
            <div style={{position:'relative', position: 'relative', margin: '0 auto', top: '25px'}}>
            <h1 style={{margin:'10px 0'}} >История</h1>
            <h3 style={{margin:'10px 5px', display:'inline-block'}}>Продажи</h3>
            <div className={this.state.grafSort === 'week'?styles.sort_push:styles.sort} style={{margin:'10px 5px', display:'inline-block'}} onClick={()=>this.change_grafSort('week')}>неделя</div>
            <div className={this.state.grafSort === 'month'?styles.sort_push:styles.sort} style={{margin:'10px 5px', display:'inline-block'}} onClick={()=>this.change_grafSort('month')}>месяц</div>
            <div className={this.state.grafSort === 'year'?styles.sort_push:styles.sort} style={{margin:'10px 5px', display:'inline-block'}} onClick={()=>this.change_grafSort('year')} >год</div>
            <Weekend_sales data={this.state.salesData} period={this.state.grafSort}></Weekend_sales>
            <Table data = {data}></Table>
            </div>

        </div>
    )}
}


class Company extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 'general',
            departments: [{
                city: '',
                street: '',
                building: ''
            }],
            title: '',
            logo: null,
            description: '',
            industry: '',
            industry_id: 0,
            balance: 0,
            isRegistered: true,
            isBalanceModalOpen: false
        };

        
        this.updateCompany = this.updateCompany.bind(this);
        
        this.updateCompany()
    }
    
    updateCompany() {

        axios.get('company')
            .then(response => {
                console.log(response.data)
                const data =  response.data
                this.setState({
                    title: data.company.title,
                    logo: '/media/' + data.company.logo,
                    description: data.company.description,
                    balance: data.company.balance,
                    industry: data.company.industry,
                    industry_id: data.company.industry_id,
                    departments: data.departments,
                    currentTab: 'general',
                    isRegistered: true
                })
                const {Company_state} = this.props
                Company_state(true, this.props.company.currentTab ||'general')
            })
            .catch(error => {
                console.log(error.response);
                this.setState({isRegistered: false})
            })
            // console.log('лупа',this.state)
            const {Company_state} = this.props
            Company_state(false, this.props.company.currentTab ||'general')
    }

    componentWillUnmount()
    {
        const {Company_state} = this.props
        Company_state(false, 'general')
    }

    openModal = () => {
        this.setState({ isBalanceModalOpen: true })
    }
  
    closeModal = (balance=this.state.balance) => {
        this.setState({ 
            isBalanceModalOpen: false,
            balance: balance
        })
    }

    render() {
        var header
        var currentComponent
        if (this.state.isRegistered)
        {
            // header =  (<div className={styles.tabs}>
            //                 <p className={styles.general} onClick={e => this.setState({currentTab: "general"})}>Общее</p>
            //                 <p className={styles.edit} onClick={e => this.setState({currentTab: "edit"})}>Редактировать</p>
            //                 <p className={styles.deps} onClick={e => this.setState({currentTab: "deps"})}>Отделения</p>
            //                 <p className={styles.cashiers} onClick={e => this.setState({currentTab: "cashiers"})}>Кассиры</p>
            //             </div>)
            
            if (this.props.company.currentTab === 'general')
            {
                currentComponent = <CompanyGeneral  openModal={this.openModal} title={this.state.title} logo={this.state.logo} industry={this.state.industry} description={this.state.description} balance={this.state.balance}/>
                                    
            }
            else if(this.props.company.currentTab === 'edit')
            {
                currentComponent = <RegisterCompany updateCompany={this.updateCompany} isRegistered={true} title={this.state.title} logo={this.state.logo} industry={this.state.industry} industry_id={this.state.industry_id} description={this.state.description}/>
            }
            else if(this.props.company.currentTab === 'deps')
            {
                currentComponent = <AddDepartments style={styles.departments} departments={this.state.departments}/>
            }
            else if(this.props.company.currentTab === 'cashiers')
            {
                currentComponent = <Cashiers style={styles.cashiersForm}/>
            }
            else if(this.props.company.currentTab === 'push')
            {
                currentComponent = <Push title={this.state.title} industry_id = {this.state.industry_id}></Push> 
            }
            else if(this.props.company.currentTab === 'card')
            {
                currentComponent = <Card title = {this.state.title} ></Card>
            }
        }
        else
        {
            header = <p className={styles.registration}>Регистрация компании</p>
            currentComponent = <RegisterCompany updateCompany={this.updateCompany} isRegistered={false}/>
        }

        return (
            <div className={styles.form}>
                {/* {header} */}
                {currentComponent}
                <ModalBalance isOpen={this.state.isBalanceModalOpen} onClose={this.closeModal} />
            </div>
        )
    }
}


export default connect (state => ({
    company: state.company,
}),{Company_state})(Company);
// export default Company