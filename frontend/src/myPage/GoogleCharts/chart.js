import React, {Component} from 'react'
import Chart from 'react-google-charts';
import axios from 'axios'
import style from './chart.module.css'




class Chart extends Component{

    constructor(props){
        super(props)

        this.state ={
            data: [],
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
            <div >
                <Chart
                    width={'500px'}
                    height={'300px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={this.state.data}
                    options={{
                        title: 'Граф',
                        // Just add this option
                        pieHole: 0.4,
                      }}
                ></Chart>
            </div>
        )
    }
}

export default Chart