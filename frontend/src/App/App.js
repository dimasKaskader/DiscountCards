import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import './app.css'

import Header from '../header/header'
import ControlPanel from '../controlPanel/ControlPanel'

// const name = connect (state => ({
//     name: state.user.name
var i = 0
// }))(<h2>{name}</h2>);
window.onscroll = function() {
    // var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    // document.getElementById('main').innerHTML = scrolled + 'px';
  }

class App extends Component{

    state = {
        curid: NaN
    }

    


handleScroll(e) {
   if(document.getElementById('main').scrollTop < 45)
   {
        document.getElementById('ControlPanel').style.bottom = document.getElementById('main').scrollTop + 'px'
   }
   else
   {
        document.getElementById('ControlPanel').style.bottom = 45 + 'px'
   }
}

updateCurid = (value) => {
    this.setState({ curid: value })
}   

    render() {
    // console.log(this.state.user)
    const {children} = this.props
        return(
            <div id='main' className='root' onScroll={ this.handleScroll }>
                    <Header updateCurid={this.updateCurid} />
                    <ControlPanel curid = {this.state.curid} updateCurid={this.updateCurid}/>
                    {children}
            </div>
        )
    }
}

export default App
