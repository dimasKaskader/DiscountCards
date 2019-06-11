import React, {Component} from 'react'
import Graf from './graf';
import style from './push.module.css'
import axios from 'axios'

class Dropdown extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dropdown_opened: false,
            industry: this.props.industries[0].title,
            arrow_rotation: {rotation: null},
        }
        this.dropdownClick = this.dropdownClick.bind(this)
        this.dropdownElClick = this.dropdownElClick.bind(this)
        this.props.getIndustry(0)
    }

    dropdownClick() {
        let arrow_rotation = null
        if (!this.state.arrow_rotation.transform)
            arrow_rotation = 'rotate(-180deg)'
        
        this.setState({
            dropdown_opened: !this.state.dropdown_opened,
            arrow_rotation: {transform: arrow_rotation}
        });
    }

    dropdownElClick(e) {
        const val = e.target.id
        this.setState({
            industry: this.props.industries[val].title,
            dropdown_opened: false,
            arrow_rotation: {transform: null}
        });
        // this.props.setIndustry(this.props.industries[val].id)
    }

    render() {
        const listItems = this.props.industries.map((industry, index) =>
            <li key={industry.id} id={index.toString()} onClick={()=>this.props.getIndustry(index)} >{industry.title}</li>
        );
        
        return(

            <div className={style.dropdown} onClick={this.dropdownClick}>
                {this.state.industry}
                <img className={style.arrow} src="/static/images/arrow.svg" alt="arrow" style={this.state.arrow_rotation}/>
                {this.state.dropdown_opened && 
                <ul className={style.dropdown_ul} onClick={this.dropdownElClick}>
                    {listItems}
                </ul>}
            </div>
        )
    }
}

class Push extends Component{

    constructor(props) {
        super(props);
        this.state = {
            target: 'myCompany',
            industries: [],
            industry: this.props.title,
            
            price: 0,
            people: 0,
            sale: 1,
            dateStart: this.getCorrectInputDate(),
            dateEnd:'',
            text:'',
            graphData: [{}],
            selectData: [{}],
            minSpent: NaN,
            maxSpent: NaN,
        };
        this.getIndustries()
        this.getData = this.getData.bind(this);
        this.postPush = this.postPush.bind(this);
        this.getData('myCompany')
    }

    postPush() {
        var data = new FormData();
        data.append('discount', this.state.sale);
        data.append('start_time', this.state.dateStart);
        data.append('end_time', this.state.dateEnd)
        data.append('min_spent', this.state.minSpent)
        data.append('max_spent', this.state.maxSpent)
        data.append('text', this.state.text)
        data.append('industry', this.state.target === 'myCompany' ? 'myCompany' : this.state.industryId)

        axios.post('push_notifications', data)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
        })
    }

    getData(industry) {
        var url
        if (industry === 'myCompany')
            url = 'clients_in_company'
        else
            url = 'clients_in_industry?industry='  + industry
        axios.get(url)
        .then(response => {
            console.log('zheppa test', response.data)
            if (response.data['10'][0])
            this.setState({
                graphData: response.data['10'], 
                selectData: response.data['100'],
                xMin: response.data['10'][6].spent_from,
                xMax: response.data['10'][1].spent_to
            })
            else
            this.setState({
                graphData: [{}], 
                selectData: [{}]
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

    getPeople(){
        var {xMin, xMax, selectData} = this.state
        console.log('x',this.state.xMin, this.state.xMax)
        var people = 0
        var cost = 0
        var minSpent = NaN
        var maxSpent = NaN
        selectData.map((element, index) => {
            // if(xMin >= element.spent_from && xMin < element.spent_to && xMax > element.spent_to) { //если выборка начинается на отрезке
            //     console.log('1', people , index)
            //     people += (element.spent_to-xMin)%((element.spent_to-element.spent_from)/element.amount)
            //     console.log('1', people)
            // }
            // else if(xMax <= element.spent_to && xMin < element.spent_from && xMax > element.spent_from){ //если выборка заканчивается на отрезке
            //     console.log('2', people, index)
            //     people += ((element.spent_to-element.spent_from) - (element.spent_to-xMax))%((element.spent_to-element.spent_from)/element.amount)
            //     console.log('2', people)
            // }    

            // else if(xMin > element.spent_from && xMax < element.spent_to) { //если выборка находится внтури отрезка
            //     console.log('3', people, index)
            //     people = (xMax-xMin)%((element.spent_to-element.spent_from)/element.amount)
            //     console.log('3', people)
            // }
            if(element.spent_from>=xMin && element.spent_to<=xMax) //если отрезок входит полностью
            {
                if(!minSpent)
                    minSpent = element.spent_from
                maxSpent = element.spent_to
                people += element.amount
                cost += element.cost
                // console.log('4', people, index)
            }

        })
        this.setState({
            people: people,
            cost: cost.toFixed(1),
            minSpent,
            maxSpent
        })
    }   

    change_target = (a) => {
        if (a=='myCompany'){
            this.setState({
                industry: this.props.title  
            })
            this.getData(a)
        }
        this.setState({
            target: a  
        })
        
    }

    getIndustries() {
        axios.get('industries')
        .then(response => {
            this.setState({
                industries: response.data
            })
        })
        .catch(error => {
            console.log(error);
        })
    }
    getIndustry = (id) => {
        this.setState({
            industry : this.state.industries[id].title,
            industryId: this.state.industries[id].id
        })
        this.getData(this.state.industries[id].id)
    }
    
    componentDidMount() {
        this.getPeople()
        this.progress_bar()
    }
    // componentDidUpdate() {
    //     this.getPeople()
    // }

    getSelect = (min, max) => {
        this.setState({
            xMin : min,
            xMax : max  
        })
        this.getPeople()
    }

    progress_bar = () => {
        var elem = document.getElementsByTagName('input')
        for(var i = 0; i < document.getElementsByTagName('input').length; i++) {
            if(elem[i].type == 'range')
            {   
                var gradValue = Math.round(((elem[i].value-elem[i].getAttribute('min'))/(elem[i].getAttribute('max')-elem[i].getAttribute('min'))*1)*100);
                var grad = 'linear-gradient(90deg,#70b86f ' + (gradValue) + '%,rgba(255,255,255,0.7) ' + (gradValue+1) + '%)';
                elem[i].style.background = grad
            }
        }
    }

    handleChange = (e) => {
        this.setState({sale: e.target.value});
        this.progress_bar()
    }
    handleAreaChange = (e) => {
        this.setState({text: e.target.value});
    }
    getCorrectInputDate(){
        var date = new Date()
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        if (month < 10) 
        month = "0" + month;
        if (day < 10) 
        day = "0" + day;   
        console.log(date.getFullYear() + '-' + month + '-' + day)
        return date.getFullYear() + '-' + month + '-' + day;
    }
    handledateStartChange=(e)=> {
        this.setState({dateStart: e.target.value});
    }
    handledateEndChange=(e)=> {
        this.setState({dateEnd: e.target.value});
    }



    render() {
        return(
            <div className={style.push_conteiner}>
                <div style = {{ margin: '0 auto', width:'1000px', position: 'relative', height: '250px'}}>
                    <h1 style = {{cursor:'default', margin: '25px 0px', marginBottom: '0px'}}>Рассылка уведомлений</h1>
                    <h5 style = {{cursor:'default', margin: '5px 0px'}}>Эти уведомления придут клиентам на их телефоны</h5>
                    <h4 style={{margin:'10px 5px 10px 0px', display:'inline-block'}}>Кому вы хотите разослать уведомления?</h4>
                    <div className={this.state.target === 'myCompany'?style.target_push:style.target} style={{margin:'10px 5px', display:'inline-block'}} onClick={()=>this.change_target('myCompany')}>Своим клиентам</div>
                    <div className={this.state.target === 'otherIndustry'?style.target_push:style.target} style={{margin:'10px 5px', display:'inline-block'}} onClick={()=>this.change_target('otherIndustry')}>Клиентам других отраслей</div>
                    {this.state.target === 'otherIndustry' &&
                        <div>
                            <h4 style={{margin:'10px 5px 10px 0px', display:'inline-block'}}>Выберите отрасль</h4>
                            <Dropdown industries={this.state.industries} getIndustry={this.getIndustry}/>
                        </div>
                    }
                    <div style={{position:'relative', position: 'relative', margin: '25px auto', maxWidth: '1115px', width: '100%'}}>
                        <h5 style = {{cursor:'default', margin: '5px 0px'}}>Выберете группу людей на этом графике</h5>
                        <Graf data={this.state.graphData} title={this.state.industry} xMin={this.state.xMin} xMax={this.state.xMax} getSelect = {this.getSelect}></Graf>
                    </div>
                    <h4 style={{margin:'10px 5px 10px 0px'}}>Вы выбрали {this.state.people} человек</h4>
                    <h4 style={{margin:'10px 5px 25px 0px'}}>Стоимость отправки push-уведомления составит {this.state.cost} баллов</h4>
                    <hr></hr>
                    <h4 style={{margin:'10px 5px 15px 0px', display:'inline-block', width:'280px'}}>Введите размер скидки {this.state.sale}%</h4>
                    <div style={{marginLeft:'15px', display:'inline-block'}}>                      
                        <label style={{display: 'inline-block', fontSize:'15px', width: '30px'}}>1%</label>
                            <input id='range' className={style.slider} type="range" min='1'  max='99' step="1" onChange={(e)=> this.handleChange(e)} value={this.state.sale}/>
                        <label style={{display: 'inline-block', fontSize:'15px',width: '30px'}}>99%</label>
                    </div>
                    <h4 style={{margin:'10px 5px 5px 0px'}}>Введите дату начала действия предложения</h4>
                    <input style={{display:'inline-block'}} className={style.date} type="date" name="calendar" value={this.state.dateStart} onChange={(e)=>this.handledateStartChange(e)}></input>
                    <h4 style={{margin:'10px 5px 5px 10px', display:'inline-block'}}>Время:</h4>
                    <input style={{display:'inline-block'}} className={style.date} type="time"></input>
                    <h4 style={{margin:'10px 5px 5px 0px'}}>Введите дату конца действия предложения</h4>
                    <input style={{display:'inline-block'}} style={{display:'inline-block', marginBottom:'25px'}} className={style.date} type="date" name="calendar" value={this.state.dateEnd} onChange={(e)=>this.handledateEndChange(e)}></input>
                    <h4 style={{margin:'10px 5px 5px 10px', display:'inline-block'}}>Время:</h4>
                    <input style={{display:'inline-block'}} className={style.date} type="time"></input>
                    <h4 style={{margin:'0px 0px 15px 0px'}}>Введите сообщение уведомления</h4>
                    <textarea style={{fontSize:'20px', marginBottom:'25px'}} value={this.state.text} className={style.description} onChange={(e)=>this.handleAreaChange(e)} placeholder='сообщение'/>
                    <div className={style.sub} onClick={this.postPush}>Отправить уведомление</div>  
                </div>
            </div>
        )
    }
}

export default Push