import React, {Component} from 'react'

import style from './MyPage.module.css'
import cn from "classnames";
import Graf from './graf/graf';
import About from './about/about'



class MyPage extends Component{

    state = {
        curid: 0
    }

    getClassNames(index){
        // console.log('Tab #' + index);
        this.setState({
            curid: index
        })
    }
    
    render() {
        var menu = [
            'Общее',
            'Рейтинг',
            'Графики',
            'Настройки'
        ]
        var object =  menu.map((value, index)=>{
            return <div className={cn( style.controls ,index==this.state.curid?style.push:NaN)} key={index} onClick={this.getClassNames.bind(this, index)}>{value}</div>
        })


        return(
            <div className={style.form} >
                <About />
                <Graf />
            </div>
        )
    }
}

export default MyPage;