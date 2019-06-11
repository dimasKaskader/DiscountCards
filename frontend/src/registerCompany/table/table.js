import React, {Component} from 'react'
import style from './table.module.css'
import axios from 'axios'
import Push_history from './Push_history';


const TABLE_COLUMNS = [
    {
        label: 'Текст',
        sort: 'default',
    },{
        label: '%',
        sort: 'default',
    },{
        label: 'Дата начала',
        sort: 'default',
    },{
        label: 'Дата конца',
        sort: 'default',
    },{
        label: 'Разослано',
        sort: 'default',
    },{
        label: 'Просмотрено',
        sort: 'default',
    },{
        label: 'Использовали',
        sort: 'default',
    }
  ];


function Thead(props)
{
    const { column, onClick } = props;
    return(
        <thead>
            <tr>
                {column.map((element, index) =>
                <th className={element.sort != 'default'? style.chose: ''} key={index} onClick={() => onClick(index, element.sort)}>{element.label}</th>
            )}
            </tr>
        </thead>
    )
}

function Tbody({data, onClick, curid})
{   
    if (data.length)
    {
    return(
        <tbody className = {style.body}>
            {data.map((element, index) =>
            <tr className={element.id === curid ? style.chose: ''} key={index} onClick={() => {onClick(element.id)}}>
                <td >{element.text}</td>
                <td >{(element.discount * 100) + '%'}</td>
                <td >{new Date(element.start_time).getDate() + '.' + new Date(element.start_time).getMonth() + '.' + new Date(element.start_time).getFullYear()}</td>
                <td >{new Date(element.end_time).getDate() + '.' + new Date(element.end_time).getMonth() + '.' + new Date(element.end_time).getFullYear()}</td>
                <td >{element.pushes_amount}</td>
                <td >{element.views}</td>
                <td >{element.used}</td>
                {/* {element.map((item, i) =>
                <td key={i}>{item}</td>)} */}
            </tr>
        )}
            <tr className = 'offer' >
                { data.length < 5 && <td style ={{color: 'rgb(112, 184, 111)'}} colSpan="7">
                Отправить больше push-уведомлений
                </td> }
            </tr>
        </tbody>
    ) }
    return ( <tr className = 'offer' >
        {data.length < 5 && <td style ={{color: 'rgb(112, 184, 111)'}} colSpan="7">
        Попробуйте отправить push-уведомление, это совсем не сложно
        </td>}
    </tr> )
}

class Table extends Component{


    constructor(props) {
        super(props);
        this.state = {
          data: [],
          column: TABLE_COLUMNS,
          curid:'',
          push_history: [],
        };
      }

    componentWillMount() {
        axios.get('push_notifications')
        .then(response => {
            this.setState({ data: response.data  })
        })
        .catch(error => {
            console.log(error);
        })
        // const { data } = this.props;
        // this.setState({ data })
      }
    
    // componentWillReceiveProps(nextProps) {
    //     const { data } = nextProps;
    //     this.setState({ data })
    // }

    GetSortData(method, id) {
        console.log(id)
        var {data} = this.state
        var sortData
        switch (id) {
            case 0:
                sortData = data.slice().sort(this.compareText)
                break
            case 1:
                sortData = data.slice().sort(this.comparePercent)
                break
            case 2:
                sortData = data.slice().sort(this.compareDateStart).reverse()
                break
            case 3:
                sortData = data.slice().sort(this.compareDateEnd).reverse()
                break
            case 4:
                sortData = data.slice().sort(this.comparePushes_amount)
                break
            case 5:
                sortData = data.slice().sort(this.compareViews)
                break
            case 6:
                sortData = data.slice().sort(this.compareUsed)
                break
        }
        if (method === 'asc')
        sortData.reverse()
        return sortData
    }

    compareText(item1, item2) { //от меньшего к большему
        if (item1.text < item2.text) return 1;
        if (item1.text > item2.text) return -1;
        else return 0

    }
    comparePercent (item1, item2) {
        return (item1.discount - item2.discount)
    }
    compareDateStart (item1, item2) {
        if (new Date(item1.start_time) < new Date(item2.start_time)) return 1;
        if (new Date(item1.start_time) > new Date(item2.start_time)) return -1;
        else return 0
    }
    compareDateEnd (item1, item2) {
        if (new Date(item1.end_time) < new Date(item2.end_time)) return 1;
        if (new Date(item1.end_time) > new Date(item2.end_time)) return -1;
        else return 0
    }
    comparePushes_amount (item1, item2) {
        return (item1.pushes_amount - item2.pushes_amount)
    }
    compareViews (item1, item2) {
        return (item1.views - item2.views)
    }
    compareUsed (item1, item2) {
        return (item1.used - item2.used)
    }

    getPush_history = (id) => {
        this.setState({ curid: id })
        const where = 'push_history_purchases?push_id=' + id.toString()
        axios.get(where)
        .then(response => {
            console.log('Push_history', response.data)
            this.setState({ push_history: response.data  })
        })
        .catch(error => {
            console.log(error.response);
        })
    }

    render() {
        return(
            <div>
                <h3 className={style.lable}>Push-уведомления</h3>
                <table className={style.pushTable} >
                    <Thead column={this.state.column}  onClick={this.changeSort}/>
                    <Tbody curid={this.state.curid} data={this.state.data} onClick={this.getPush_history}/>
                </table>
                <h3 className={style.lable}>Покупки клиентов</h3>
                <Push_history data = {this.state.push_history} active = {this.state.curid}></Push_history>
            </div>
        )
    }

    changeSort = (id, sort) =>{
        const {column, data} = this.state
    
        var corSort = 'default'
        switch (sort) {
            case 'default':
                corSort = 'asc';
                break;
            case 'asc':
                corSort = 'desc';
              break;
            case 'desc':
                corSort = 'asc';
              break;
            default:
                corSort = 'asc';
          }

        const changeColumn = column.map((e, i) =>
            ({ ...e, sort: i === id ? corSort : 'default' })
        );
        const sortData = this.GetSortData(corSort, id)

        this.setState({
            data: sortData,
            column: changeColumn,
        })
    }

}

export default Table