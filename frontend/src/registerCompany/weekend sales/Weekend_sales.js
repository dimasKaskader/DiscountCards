import React, {Component} from 'react'
import { VictoryChart, VictoryArea, VictoryTheme, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryVoronoiContainer,VictoryGroup, VictoryScatter, VictoryLine } from 'victory';
import style from './weekend_sales.module.css'
const axios = require('axios');

class Weekend_sales extends Component{

    getTickXFormat()
    {
        var  tickValues = []
        var days = ['ВC', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
        if(this.props.period=='month')
        {   
            var months = ['янв.', 'фев.', 'мар.', 'апр.','май', 'июн.', 'июл.', 'авг.','сен.', 'окт.', 'ноя.', 'дек.'];
            // for (var j = 0; j < 5; j++)
            // tickValues.push(' ');
            for (var i = 0; i< this.props.data.length; i+=7)
            {
                var date = new Date(this.props.data[i].purchase_time)
                tickValues.push( date.getDate() + ' ' + months[date.getMonth()]);
                for (var j = 0; j < 6; j++)
                tickValues.push(' ');
            }
        }
        if(this.props.period=='year') 
        {
            var months = ['янв.', 'фев.', 'мар.', 'апр.','май', 'июн.', 'июл.', 'авг.','сен.', 'окт.', 'ноя.', 'дек.'];
            for (var i = 0; i< this.props.data.length; i+=89)
            {
                var date = new Date(this.props.data[i].purchase_time)
                tickValues.push( date.getDate() + ' ' + months[date.getMonth()] + '' + date.getFullYear());
                for (var j = 0; j < 88; j++)
                tickValues.push(' ');
            }
        }
        else{

        this.props.data.map((element, index) => {
            var date = new Date(element.purchase_time)
            if (date.getDate() == new Date().getDate())
            tickValues.push( 'Сегодня');
            else
            tickValues.push( days[date.getDay()]);
        });}
        return tickValues
    }
    getTickX()
    {

        var  tickValues = []
        this.props.data.map((element, index) => {
            tickValues.push(element.purchase_time);
        });
        return tickValues
    }
    getDate(date)
    {
        var months = ['янв.', 'фев.', 'мар.', 'апр.','май', 'июн.', 'июл.', 'авг.','сен.', 'окт.', 'ноя.', 'дек.'];
        var d = new Date(date)
        var obj = {
            month: months[d.getMonth()],
            day: d.getDate(),
            year: d.getFullYear()
        }
        return (obj.day + ' ' + obj.month + ' ' + obj.year)
    }
    render() {
        return(
            <div className={style.conteiner}>
            {/* <svg width={650} height={360} style={{margin: '-15px -15px 0px -15px', position: 'relative', boxSizing: 'border-box'}}> */}
            {/* <defs>
            <linearGradient id="gradient1" 
              x1="0%" y1="0%" x2="0%" y2="100%"
            >
              <stop offset="0%"   stopColor="rgb(142, 204, 141)"/>
              <stop offset="100%" stopColor="rgba(112, 184, 111, 0.3)"/>
            </linearGradient>
            </defs> */}
                <VictoryChart
                    // standalone={false}
                    width ={650}
                    height = {360}
                    domainPadding={{x:35, y:5}}
                    containerComponent={
                        <VictoryVoronoiContainer/>
                      }
                >
                <VictoryAxis
                    tickValues={ this.getTickX()}
                    tickFormat ={this.getTickXFormat()}
                    style={this.props.period != 'year'? {
                        axisLabel: {fontSize: 18, padding: 30, },
                        grid: {stroke: '#7b7b7b', strokeWidth:'1.5', opacity: '0.4'},
                        ticks: {stroke: "grey", size: 2},
                        tickLabels: {fontSize: 15, padding: 5, fill: "grey"}
                    }: {
                        axisLabel: {fontSize: 18, padding: 30, },
                        // grid: {stroke: '#7b7b7b', strokeWidth:'1.5', opacity: '0.4'},
                        ticks: {stroke: "grey", size: 2},
                        tickLabels: {fontSize: 15, padding: 5, fill: "grey"}
                    }
                }
                />
                <VictoryGroup
                    data={this.props.data}
                    data={this.props.data.map(point => ({
                        ...point,
                        label: ((point.sum*1).toFixed(2)) + ' руб'+ ', ' + this.getDate(point.purchase_time)
                      }))}
                      labelComponent={<VictoryTooltip/>}

                    // labels={data => `y: ${data.sum}`}

                    // labels={(datum) => (`${datum.sum.toFixed(0)} р.`)}
                    // labelComponent={<VictoryTooltip renderInPortal />}
                    y="sum"
                    x="purchase_time"

                >

                    <VictoryArea
                        interpolation="natural"
                        // style={{  data: {
                        //     fill: "url(#gradient1)", fillOpacity: 0.6, marginTop:'15px', stroke: "#70b86f", strokeWidth: 3
                        //   }}}
                        style={{  data: {
                            fill: "#70b86f", fillOpacity: 0.3, marginTop:'15px', stroke: "#70b86f", strokeWidth: 3
                          }}}
                    />
                    <VictoryScatter
                        size={(d, a) => {return a ? 8 : 3;}}
                     />
                </VictoryGroup>
                </VictoryChart>
            {/* </svg>     */}
            </div>
        )
    }
}

export default Weekend_sales