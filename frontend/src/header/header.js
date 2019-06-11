import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import style from './header.module.css'


class Header extends Component{
    render() {
        return(
            <div className = {style.header}>
                <div className = {style.green_header}>
                    <h1><Link exact to='/'  onClick={() => { this.props.updateCurid(NaN)}}  >discountcards</Link></h1>
                </div>
            </div>
        )
    }
}

export default Header;