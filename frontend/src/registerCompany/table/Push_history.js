import React, {Component} from 'react'
import style from './Push_history.module.css'

const TABLE_COLUMNS = [
    {
        label: 'id',
        sort: 'default',
    },{
        label: 'Дата',
        sort: 'default',
    },{
        label: 'Потратил',
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
                  <th className={element.sort != 'default'? style.chose: ''} key={index} onClick={() => onClick(element.sort, index)}>{element.label}</th>
              )}
              </tr>
          </thead>
      )
  }
  
  function Tbody({data, nonPurchase, active})
  {
    if (active) {
      if (!nonPurchase)
      {
      return(
          <tbody className = {style.body}>
              {data.map((element, index) =>
              <tr key = {index}>
                  <td >{index + 1}</td>
                  <td >{new Date(element.purchase_time).getDate() + '.' + new Date(element.purchase_time).getMonth() + '.' + new Date(element.purchase_time).getFullYear()}</td>
                  <td >{element.price+' ₽'}</td>
                  {/* {element.map((item, i) =>
                  <td key={i}>{item}</td>)} */}
              </tr>
          )}
          </tbody>
      ) }
      return (
            <tbody>
                <tr>
                    <td style ={{color: 'rgb(112, 184, 111)', textAlign: 'center', width: '100%'}} colSpan="3"> 
                    Кажется, по вашему <br /> уведомлению, <br /> никто не откликнулся <br /> :c
                    </td>
                </tr>
            </tbody> 
      )
    }
    return (
        <tbody>
            <tr>
                <td style ={{color: 'rgb(112, 184, 111)', textAlign: 'center'}} colSpan="3">
                Чтобы увидеть статиситку <br /> по покупкам, <br /> выберете нужное <br /> вам push-уведомление
                </td>
            </tr> 
        </tbody>
      )
}

class Push_history extends Component{
    constructor(props) {
        super(props);
        this.state = {
          data: this.props.data,
          column: TABLE_COLUMNS,
          push_history: [],
          nonPurchase: false,
          active: false
        };
      }
      changeSort = (id, sort) =>{
        const {column, data} = this.state
        if (data.length <= 1)
        return
    
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

    componentWillReceiveProps(nextProps) {
        const { data, active } = nextProps;
        if(active)
            this.setState({ active: true })
        if(data.length){
            this.setState({ data })
            this.setState({ nonPurchase: false })
        }
        else 
        this.setState({ nonPurchase: true })
    }

    GetSortData(method, id) {
        var {data} = this.state

        var sortData
        switch (id) {
            case 0:
                sortData = data
                break
            case 1:
                sortData = data.slice().sort(this.comparePercent)
                break
            case 2:
                sortData = data.slice().sort(this.compareDateStart).reverse()
                break
        }
        if (method === 'asc')
        sortData.reverse()
        console.log(sortData)
        return sortData
    }


    render() {
        return(
            <table  className={style.purchasesTable} >
                <Thead column={this.state.column}  onClick={this.changeSort}/>
                <Tbody data={this.state.data} nonPurchase={this.state.nonPurchase} active={this.state.active}/>
            </table>
        )
    }
}

export default Push_history