import React, {Component} from 'react'
import style from './card.module.css'
import axios from 'axios'



var data = [
   {min: 1, percent: 100, max: 100, sale: 2},
   {min: 15, percent: 70, max: 75, sale: 5},
   {min: 10, percent: 50, max: 50, sale: 7},
   {min: 5, percent: 25, max: 30, sale: 8},
   {min: 1, percent: 5, max: 15, sale: 10},
]

class Сard_leavel extends Component 
{   
    
    // componentWillUpdate(nextProps) {
    //     // console.log(nextProps)
    //     // nextProps.progress_bar()
    //     this.props.progress_bar()
    // }
    componentDidUpdate() {
        this.props.progress_bar()
    }
    

    render(){

    const {data, onChange, onSaleChange} = this.props
    return(
        <div style={{marginBottom:'25px'}}>
            {data.map((element, index) =>
            <div key={index} className = {style.card_leavel}>  {/*статус карты*/}
                <div style={{width:'90px', textAlign:'center', lineHeight:'86px',  cursor: 'default'}}>{index + 1}.</div>
                <div style={{width:'320px', textAlign:'center'}}>
                    {/* <input className = {style.percent_input} style={{width:'45px', display: 'inline-block'}}  maxLength='3'></input> */}
                    {/* <label style={{display: 'inline-block'}}>%</label> */}
                    <div style={{fontSize:'20px', cursor: 'default'}}>{element.percent}%</div>
                    
                    {index == 0 &&
                    <div>
                        <label style={{display: 'inline-block', fontSize:'15px', width: '30px'}}>{element.min}%</label>
                        <input id='range' className={style.slider} type="range" min={element.min}  max={element.max} step="1" onChange={(e)=>(onChange(e, index))} value={element.percent}/>
                        <label style={{display: 'inline-block', fontSize:'15px',width: '30px'}}>{element.max}%</label>
                    </div>
                    }
                    {index != 0 &&
                    <div>
                        <label style={{display: 'inline-block', fontSize:'15px',width: '30px'}}>{element.min}%</label>
                        <input id='range' className={style.slider} type="range" min={element.min}  max={data[index-1].percent-1} step="1" onChange={(e)=>(onChange(e, index))} value={element.percent}/>
                        
                        <label style={{display: 'inline-block', fontSize:'15px', width: '30px'}}>{data[index-1].percent-1}%</label>
                    </div>
                    }
                    <h5 style={{margin:'5px', bottom:'5.5px', position:'relative', display: 'inline-block', fontWeight: 'normal'}} >лучших клиентов</h5>
                </div>
                <div style={{width:'90px', textAlign:'center', margin:'auto 0'}}>
                    <input className = {style.percent_input} style={{width:'45px', display: 'inline-block'}}  maxLength='2' onChange={(e)=>(onSaleChange(e, index))} value={element.sale}></input>
                    <label style={{display: 'inline-block'}}>%</label>
                    { (index != 0 && data[index-1].sale >= element.sale && data[index-1].sale != 99) &&
                        <div id='error' style={{fontSize:'12px', cursor: 'default', color: 'red', textAlign: 'left', position: 'absolute'}}>скидка <br /> должна быть > {data[index-1].sale}%</div>
                    }
                </div>
            </div>
        )}
        </div>
    )}
}

class Card extends Component{
    constructor(props) {
        super(props);
        this.state = {
            value:'1',
            data: data,
            haveCard: false
        };
        this.postDiscount = this.postDiscount.bind(this);
        this.getDiscount = this.getDiscount.bind(this);
        this.getDiscount()
    }

    postDiscount() {
        this.state.data.forEach((currentValue, index, array) => {
            axios.post('company_discount', {
                name: index + 1,
                threshold_sum: currentValue.percent,
                discount: currentValue.sale
            })
            .then(response => {
                console.log('discount', response.data)
            })
            .catch(error => {
                console.log(error);
            })
        })
    }

    getDiscount() {
        axios.get('company_discount')
        .then(response => {
            console.log('discount', response.data)
            if(response.data.length > 0)
            {
                var newData = []
                response.data.forEach((val, index, array) => {
                    newData.push({
                        sale: val.discount,
                        percent: val.threshold_sum,
                        min: data[index].min,
                        max: data[index].max,
                    })
                })
                this.setState({data: newData, haveCard: false})
            }
            else 
            {
                this.setState({haveCard: false})
            }
        })
        .catch(error => {
            console.log(error);
        })

        axios.get('company_history_purchases')
        .then(response => {
            console.log('history_purchases', response.data)
        })
        .catch(error => {
            console.log(error);
        })
    }
    progress_bar = () => {
        var elem = document.getElementsByTagName('input')
        for(var i = 0; i < document.getElementsByTagName('input').length; i++) {
            if ( i == 0 )
            {
                elem[i].style.background = '#999999'
                elem[i].classList = style.first_slider
                continue
            }
            if(elem[i].type == 'range')
            {   
                var gradValue = Math.round(((elem[i].value-elem[i].getAttribute('min'))/(elem[i].getAttribute('max')-elem[i].getAttribute('min'))*1)*100);
                var grad = 'linear-gradient(90deg,#70b86f ' + (gradValue) + '%,#cccccc ' + (gradValue+1) + '%)';
                elem[i].style.background = grad
            }
        }
    }
    componentDidMount() {
        // if(document.getElementsByTagName('input').type == "range")
        console.log(document.getElementsByTagName('input'))
        this.progress_bar()
    }



    handleChange = (e, i) => {
        if( i == 0 )
        return
        // var gradValue = Math.round((e.target.value/e.target.getAttribute('max')*1)*100);
        // var grad = 'linear-gradient(90deg,#70b86f ' + ( gradValue-5) + '%,#cccccc ' + ( gradValue+1) + '%)';
        // e.target.style.background = grad

        data = this.state.data
        data[i].percent = e.target.value
            for(var j = i; j<data.length-1; j++)
            {   
                if (data[j].percent<=data[j+1].percent)
                data[j+1].percent=data[j].percent-1
            }
        this.setState({data: data});
        // this.progress_bar()
    }

    handleSaleChange=(e, i) => {
        e.target.value = e.target.value.replace(/\D/g, '')
        var data = this.state.data
        data[i].sale=e.target.value
        this.setState({
            data: data
        })
    }

    render() {
        return(
            <div className = {style.card_conteiner} >
                <div style = {{ margin: '0 auto', width:'900px', position: 'relative', height: '250px'}}>
                    {!this.state.haveCard &&
                        <div>
                            <h2 style = {{cursor:'default', margin: '25px 0px'}}>Кажется у вас ещё нет карты, давайте её создадим!</h2>
                            <h4 style = {{cursor:'default', margin: '25px 0px'}}>Мы подготовили оптимальные значения для вас</h4>
                        </div>
                    }
                    { this.state.haveCard &&
                        <h1 style = {{cursor:'default', margin: '25px 0px'}}>Настройка скидочной карты компании</h1>
                    }
                    <div className = {style.card}>
                        <div className = {style.card_header}>
                            {this.props.title}
                        </div>

                        <div className = {style.card_leavel_header} style={{marginBottom:'25px'}}>  {/*шапка*/}
                            <div style={{width:'90px', textAlign:'center'}}>ур. карты</div>
                            <div style={{width:'300px', textAlign:'center'}}>процент клиентов
                                <br />
                                <h6 style={{margin:'5px 0'}} >выберете процент клиентов, которым достанется эта карта</h6>
                            </div>
                            <div style={{width:'90px', textAlign:'center'}}>скидка
                                <br />
                                <h6 style={{margin:'5px 0'}} >не больше 99%</h6>
                            </div>
                        </div>

                        <Сard_leavel data={this.state.data} onChange={this.handleChange} onSaleChange={this.handleSaleChange} progress_bar={this.progress_bar}/>
                        {/* <p style={{color:'red', margin:'10px 0', position: 'absolute'}} >скидка большей по уровню карты не может быть меньше меньшей</p> */}
                        <div className={style.sub} onClick={this.postDiscount}>{this.state.haveCard?'Сохранить изменения':'Создать карту'}</div>


                    </div>
                </div>
            </div>
        )
    }
}

export default Card