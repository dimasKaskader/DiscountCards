import React, {Component} from 'react'
import { VictoryChart, VictoryArea, VictoryTheme, VictoryAxis, VictoryBrushContainer } from 'victory';
import style from './graf.module.css'
import axios from 'axios'

const data = [
    {group: 0, amount: 101, spent_from: 500, spent_to: 100043},
    {group: 1, amount: 86, spent_from: 100592, spent_to: 198421},
    {group: 2, amount: 99, spent_from: 201680, spent_to: 298861},
    {group: 3, amount: 78, spent_from: 300753, spent_to: 399348},
    {group: 4, amount: 123, spent_from: 400673, spent_to: 498304},
    {group: 5, amount: 91, spent_from: 500332, spent_to: 598164},
    {group: 6, amount: 103, spent_from: 599942, spent_to: 697828},
    {group: 7, amount: 114, spent_from: 699483, spent_to: 796521},
    {group: 8, amount: 98, spent_from: 798816, spent_to: 897626},
    {group: 9, amount: 113, spent_from: 901259, spent_to: 997760},
  ];


class Graf extends Component{
    getTickX (){
        var  tickValues = []
        this.props.data.map(function(data) {
            tickValues.push( data.spent_from);
        });
        return tickValues
    }
    getTickY (){
        var  tickValues = []
        for (var i = 0; i< this.props.data.length; i++)
        {
            tickValues.push( this.props.data[i].amount);
        }
        console.log ('--tick' + tickValues)
        return tickValues
    }
    getTickYFormat()
    {
        var  tickValues = []
        tickValues.push( this.props.data[0].amount);
        for (var i = 0; i< this.props.data.length-2; i++)
        {
            tickValues.push(' ');
        }
        tickValues.push( this.props.data[this.props.data.length-1].amount);
        return tickValues
    }

    handleDomainChange(domain, props) {
        this.props.getSelect(domain.x[0], domain.x[1])
        // console.log(domain)
    }    
    
    render() {
        // console.log('data', this.props.data)
        return(
            <div className={style.conteiner}>
            <h3 style={{textAlign: 'center', margin:'0px'}}>{this.props.title}</h3>
            {/* <svg width={1100} height={410} style={{margin: '-15px 0px 0px 0px', padding: '0PX 15PX', POSITION: 'relative', boxSizing: 'border-box', width: '100%'}}>
                <g> */}
                <VictoryChart

                    standalone={true}
                    theme={VictoryTheme.material}
                    width ={800}
                    height = {400}
                    domainPadding={{y:25}}
                // domain={{ }}
                    containerComponent={<VictoryBrushContainer
                        brushDimension="x"
                        brushDomain={{x: [this.props.xMin, this.props.xMax]}}
                        onBrushDomainChange={(domain, props) => this.handleDomainChange(domain, props)}
                    />}
                >
                <VictoryAxis
                    theme={VictoryTheme.grayscale}
                    tickValues={this.getTickX()}
                    tickFormat ={(x) => (`${(x / 1000).toFixed(0)} тыс.`)}
                    label ={'Траты, которые они совершают(₽)'}
                    style={{
                        axisLabel: {fontSize: 17, padding: 30},
                        grid: {stroke: '#7b7b7b', strokeWidth:'1.5', opacity: '0.4'},
                        ticks: {stroke: "grey", size: 5},
                        tickLabels: {fontSize: 15, padding: 5}
                      }}
                />
                <VictoryAxis
                    dependentAxis
                    // tickFormat specifies how ticks should be displayed
                    
                    // tickFormat={[20,40,60,80,100,120,140, 160, 180, 200,220]}
                    tickValues={this.getTickY()}
                    tickFormat={this.getTickYFormat()}
                    // domainPadding={{x:35, y:-15}}
                    label ={'Людей'}
                    style={{
                        axisLabel: {fontSize: 17, padding: 15},
                        grid: {stroke: '#7b7b7b', strokeWidth:'1.5', opacity: '0.4'},
                        ticks: {stroke: "grey", size: 5},
                        tickLabels: {fontSize: 15, padding: 5},
                        label: {position: 'absolute'}
                      }}
                />
                    <VictoryArea
                        interpolation="natural"
                        style={{  data: {
                            fill: "#70b86f", fillOpacity: 0.6, stroke: "#70b86f", strokeWidth: 3
                          } }}
                        width={800}
                        height = {380}
                        data = {this.props.data}
                        y="amount"
                        x="spent_from"
                    />
                </VictoryChart>
                {/* </g>
            </svg>     */}
            </div>
        )
    }
}

export default Graf