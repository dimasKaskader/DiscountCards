import React, {Component} from 'react'
import styles from "./citySearch.module.css"
const axios = require('axios');

class CitySearch extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            show_list: {visibility: 'hidden'},
        }

        this.onFocus = this.onFocus.bind(this)
        this.onLostFocus = this.onLostFocus.bind(this)
        this.dropdownElClick = this.dropdownElClick.bind(this)
        this.cityChange = this.cityChange.bind(this)
        this.getCities = this.getCities.bind(this)

        this.getCities('')
    }

    onFocus() {
        this.setState({show_list: {visibility: 'visible'}})
    }

    onLostFocus() {
        this.setState({show_list: {visibility: 'hidden', opacity: 0}})
    }

    dropdownElClick(event) {
        //event.persist();
        var city = event.target.id
        this.props.setCity(city)
    }

    cityChange(event) {
        var city = event.target.value
        this.getCities(city)
        this.props.setCity(city)
    }

    getCities(city) {
        axios.get('city?title=' + city)
        .then((response) => {
            this.setState({cities: response.data})
            //console.log(response)
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        const listItems = this.state.cities.map((city, index) =>
            <li key={city.id} id={city.title}>{city.title}</li>
        );
        
        return(
            <>
            <input className={this.props.style} id="city" type="text" name="city" placeholder="Город" onFocus={this.onFocus} onBlur={this.onLostFocus} value={this.props.city} onChange={this.cityChange} autoComplete="off"/>
            <ul className={styles.dropdown_ul} style={this.state.show_list} onClick={this.dropdownElClick}>
                {listItems}
            </ul>
            </>
        )
    }
}

export default CitySearch