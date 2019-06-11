import React, {Component} from 'react'
import { VictoryPie } from 'victory';
import axios from 'axios'
import style from './graf.module.css'

var ebalo = NaN

class Graf extends Component{
    constructor(props){
        super(props)

        this.state ={
            price: '',
            discount: '',
            allPrice: '',
            allDiscount: '',
            curid1: NaN,
            curid2: NaN,
            data: [],
            hint: null
        }
    }

    componentDidMount(){
        axios.get('spending_per_industry')
        .then(response => {
            console.log('govno', response.data)
            this.setState({
                data : response.data
            })
            this.giveAllcash(this.state.data)
        })
        .catch(error => {
            console.log(error);
        })

    }

    giveAllcash(data) {
        console.log('fas'+data)
        var allP = 0
        var allD = 0
        for (var i = 0; i<data.length; i++) {
            allP += data[i].price
            allD += data[i].discount
        }
          this.setState({
            allPrice :  allP.toFixed(2),
            allDiscount: allD.toFixed(2)
        })
    }


    render() {

        return(
            <div className={style.graf_conteiner}>
            <div className={style.block}>
            <label style= {{marginBottom :'15px'}}>Потрачено</label>
                <svg width={310} height={280}>
                    <g>
                        <text x='180' y="133" fontSize="20" textAnchor ='middle'>
                            <tspan x="180" y="133" fontSize="15">{this.state.price.split(':', 2)[0]}</tspan>
                            <tspan x="180" y="153">{this.state.price.split(':', 2)[1]}</tspan>
                        </text>              
                            <VictoryPie
                            colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
                            width={360} height={270}
                            innerRadius={85}
                            standalone={false}
                            radius={130}
                            padAngle={3}
                            labelRadius={90}
                            textAnchor={'middle'}
                            style={{ labels: { fontSize: 15} }}
                            animate={{
                                duration: 2000
                            }}
                            data={this.state.data}
                            x="industry"
                            y="price"
                            events={[
                                {
                                target: "data",
                                eventHandlers: {
                                    onClick: () => {
                                        return [
                                        {
                                            target: "data",
                                            mutation: (props) => {
                                                if (ebalo === props.index)
                                                {
                                                    ebalo = NaN
                                                    this.setState({ curid1: NaN, price: '' })
                                                    //console.log(ebalo)
                                                    return {style:  props.style}
                                                }
                                                else {
                                                    
                                                    ebalo = props.index
                                                    this.setState({ curid1: props.index,
                                                    price: props.data[props.index].industry + ':' + props.data[props.index].price.toFixed(2) + ' ₽' })
                                                    // return { style: { fill: "#70b86f",
                                                    // transform: 'scale(1.1, 1.1)' } };
                                                    // console.log(ebalo)
                                                    return {style: undefined}
                                                }
                                                
                                            }
                                        },
                                        {
                                            target: "data",
                                            eventKey: "all",
                                            mutation: (props) => {
                                                if(ebalo || ebalo === 0)
                                                {
                                                    if(props.index !== ebalo)
                                                        return { style: {opacity: '0.1'}};
                                                    else
                                                        return {style: undefined}
                                                }
                                                else
                                                {
                                                    //console.log('penis')
                                                    return {style: undefined}
                                                }
                                            }
                                        }
                                    ];
                                    },
                                    onMouseEnter: (e) => {
                                        //console.log('penis')
                                        return {
                                            target: "data",
                                            mutation: (props) => {
                                                var div = document.createElement('div');
                                                this.setState({hint: div})
                                                div.id = 'hint'
                                                div.style.position = 'absolute';
                                                div.style.display = 'block';   
                                                div.style.left = (e.pageX + 25).toString() + 'px';   // Координаты дива X и Y не забываем указать еденицы измерения,
                                                div.style.top = e.pageY.toString() + 'px';    // например 40px или 20%
                                                div.style.background = 'red';   //  Див с красной заливкой ))
                                                div.appendChild(document.createTextNode(props.data[props.index].industry));  //  Добавим текст в див
                                                document.body.appendChild(div);
                                                return {style: props.style}
                                            }
                                        }
                                    },
                                    onMouseLeave: (e) => {
                                        return {
                                            target: 'data',
                                            mutation: (props) => {
                                                var hint = this.state.hint
                                                if (hint)
                                                {
                                                document.body.removeChild(hint);
                                                this.setState({hint: null})
                                                }
                                                return {style: props.style}
                                            }
                                        }
                                    },
                                    onMouseMove: (e) => {
                                        return {
                                            target: 'data',
                                            mutation: (props) => {
                                                if (this.state.hint)
                                                {
                                                    this.state.hint.style.left = (e.pageX + 25).toString() + 'px'
                                                    this.state.hint.style.top = (e.pageY + 10).toString() + 'px'
                                                }
                                                return {style: props.style}
                                            }
                                        }
                                    }
                                }
                                }
                            ]}
                            />    
                    </g>
                </svg>
                <label>Всего: {this.state.allPrice}₽</label>
            </div>
            <div className={style.block}>
            <label style= {{marginBottom :'15px'}} >Сэкономлено</label>
                <svg width={310} height={280}>
                    <g>
                        <text x='180' y="133" fontSize="20" textAnchor ='middle'>
                            <tspan x="180" y="133" fontSize="15">{this.state.discount.split(':', 2)[0]}</tspan>
                            <tspan x="180" y="153">{this.state.discount.split(':', 2)[1]}</tspan> 
                        </text>           
                            <VictoryPie
                            colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
                            width={360} height={270}
                            innerRadius={85}
                            standalone={false}
                            radius={130}
                            padAngle={3}
                            labels = {null}
                            verticalAnchor = 'start'
                            style={{ labels: { fontSize: 15} }}
                            data={this.state.data}
                            x="industry"
                            y="discount"
                            events={[
                                {
                                target: "data",
                                eventHandlers: {
                                    onClick: () => {
                                    return [{
                                        target: "data",
                                        eventKey: "all",
                                        mutation: (props) => {
                                            return { style: undefined};
                                            }
                                        }, {
                                        target: "data",
                                        mutation: (props) => {
                                            if (this.state.curid2 == props.index)
                                            {
                                                this.setState({ curid2: NaN, discount: ''  })
                                                return {style: this.props.style}
                                            }
                                            else {
                                                this.setState({ curid2: props.index,
                                                    discount: props.data[props.index].industry+':' + props.data[props.index].discount.toFixed(2)+' ₽' })
                                                return { style: { fill: "#70b86f" } };
                                            }
                                        }
                                    }, 
                                    ];
                                    }
                                }
                                }
                            ]}
                            />
                    </g>
                </svg>
                <label>{'Всего: '+this.state.allDiscount+'₽'}</label>
            </div>

            </div>
        )
    }
}

export default Graf