import React, {Component} from 'react'
import styles from "./registerCompany.module.css"
import AddDepartments from "./addDepartments.js"
import CitySearch from "./citySearch.js"
const axios = require('axios');


class Dropdown extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dropdown_opened: false,
            dropdown: 'Отрасль компании',
            dropdown_color: null,
            arrow_rotation: {rotation: null},
        }
        if(this.props.industry)
        {
            this.state.dropdown = this.props.industry
            this.state.dropdown_color = 'black'
        }
        this.dropdownClick = this.dropdownClick.bind(this)
        this.dropdownElClick = this.dropdownElClick.bind(this)
    }

    dropdownClick() {
        let arrow_rotation = null
        if (!this.state.arrow_rotation.transform)
            arrow_rotation = 'rotate(-180deg)'
        
        this.setState({
            dropdown_opened: !this.state.dropdown_opened,
            arrow_rotation: {transform: arrow_rotation}
        });
    }

    dropdownElClick(e) {
        const val = e.target.id
        this.setState({
            dropdown: this.props.industries[val].title,
            dropdown_opened: false,
            dropdown_color: 'black',
            arrow_rotation: {transform: null}
        });
        this.props.setIndustry(this.props.industries[val].id)
    }

    render() {
        const listItems = this.props.industries.map((industry, index) =>
            <li key={industry.id} id={index.toString()} >{industry.title}</li>
        );
        
        return(

            <div className={styles.dropdown} onClick={this.dropdownClick} style={{ visibility: this.props.display}}>
                {this.state.dropdown}
                <img className={styles.arrow} src="/static/images/arrow.svg" alt="arrow" style={this.state.arrow_rotation}/>
                {this.state.dropdown_opened && 
                <ul className={styles.dropdown_ul} onClick={this.dropdownElClick}>
                    {listItems}
                </ul>}
            </div>
        )
    }
}

class Logo extends Component{
    constructor(props) {
        super(props);
        if (this.props.logo)
            this.state = {
                logo: this.props.logo,
            }
        else
            this.state = {
                logo: null,
            }
        this.logoInput = React.createRef();
        this.logoClick = this.logoClick.bind(this);
        this.logoFileChange = this.logoFileChange.bind(this);
    }

    logoClick() {
        this.logoInput.current.click()
    }

    logoFileChange() {
        var reader  = new FileReader()
        var file = this.logoInput.current.files[0]
        reader.onloadend = (e) => {
            this.setState({logo: reader.result})
        }
        if(file)
            if(file.type.includes('image'))
            {
                reader.readAsDataURL(file)
                this.props.setLogo(file)
            }
    }

    render() {     
        return(
            <div>
                <img className={this.state.logo ?styles.logo:styles.addPhoto} src={this.state.logo||"/static/images/add-photo.svg"} onClick={this.logoClick} alt="Нажмите, чтобы добавить изображение"/>
                <input className={styles.file} type="file" ref={this.logoInput} onChange={this.logoFileChange}/>
            </div>
        )
    }
}

class CompanyRegistration extends Component{
    constructor(props) {
        super(props);
        if(this.props.isRegistered)
            this.state = {
                title: this.props.title,
                logo: this.props.logo,
                description: this.props.description,
                industries: [],
                industry: this.props.industry_id,
                industry_title: this.props.industry
                /*departments: [{
                    city: '',
                    street: '',
                    building: ''
                }]*/
            };
        else
            this.state = {
                title: '',
                logo: null,
                description: '',
                industries: [],
                industry: 0,
                compleate: false,
                city: ''
                /*departments: [{
                    city: '',
                    street: '',
                    building: ''
                }]*/
            };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        /*this.departmentInput = this.departmentInput.bind(this);
        this.addDepartment = this.addDepartment.bind(this);*/
        this.setIndustry = this.setIndustry.bind(this);
        this.setLogo = this.setLogo.bind(this);
        this.setCity = this.setCity.bind(this);

        axios.get('industries')
            .then(response => {
                this.setState({
                    industries: response.data
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    setCity(city) {
        this.setState({city})
    }

    handleSubmit(event) {
        event.preventDefault();
        var data = new FormData();
        data.append('title', this.state.title);
        data.append('description', this.state.description);
        data.append('logo', this.state.logo)
        data.append('industry', this.state.industry)
        data.append('city', this.state.city) //!!!УБРАТЬ
        var method
        console.log('бакуган',this.props.isRegistered)
        console.log('бакуган2',data.getAll)
        if(this.props.isRegistered)
            method = axios.put
        else
            method = axios.post

        method('company', data)
        .then((response) => {
            console.log(response)
            /*for (var i = 0; i < this.state.departments.length; i++) 
            {
                axios.post('departments', this.state.departments[i])
                .then((response) => {
                    console.log(response)
                })
            }*/
            this.setState({compleate: true});
            this.props.updateCompany()
        })
        .catch(error => {
            console.log(error.response);
        })
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value,
        compleate: false});
    }  

    /*departmentInput(e, index, element) {
        var departments = this.state.departments.slice()
        departments[index][element] = e.target.value
        this.setState({departments})
    }

    addDepartment() {
        var departments = this.state.departments
        this.setState({
            departments: departments.concat([{
                city: '',
                street: '',
                building: ''
            }])
        })
    }*/

    setIndustry(val) {
        this.setState({
            industry: val
        })
    }

    setLogo(file) {
        this.setState({
            logo: file,
            compleate:false
        })
    }

    render() {
        var regButton
        var industry
        if(this.props.isRegistered)
        {
            regButton = "Сохранить изменения"
            industry = 'hidden'
        }
        else
        {
            regButton = "Зарегистрировать компанию"
            industry = 'visible'
        }
            
        return(
            //<form onSubmit={this.handleSubmit}>
                <div className={styles.registration_conteiner}>
                    <div style = {{ margin: '0 auto', width:'600px', position: 'relative'}}>
                        <Logo setLogo={this.setLogo} logo={this.state.logo}/>
                        <input className={styles.name} id="title" type="text" name="title" placeholder="Название компании" value={this.state.title} onChange={this.handleChange} autoComplete="off"/>
                        {!this.props.isRegistered && <CitySearch style={styles.city} setCity={this.setCity} city={this.state.city}/>}
                        <Dropdown industries={this.state.industries} setIndustry={this.setIndustry} industry={this.state.industry_title} display={industry}/>
                        <textarea style={{fontSize:'20px'}} value={this.state.description} name="description" onChange={this.handleChange} placeholder="Описание компании"/>
                        {//<AddDepartments style={styles.departments} handler={this.departmentInput} departments={this.state.departments} addDepartment={this.addDepartment}/>
                        }
                    </div>
                    {!this.state.compleate &&
                        <div style={{top: '150px', position:'absolute', position: 'relative', margin: '0 auto'}} className={styles.border} onClick={this.handleSubmit}>
                            <input className={styles.button} type="submit" name="register" value={regButton} style={{color: 'white'}}/>
                        </div>
                    }
                    {this.state.compleate &&
                        <div style={{top: '150px', position: 'relative', margin: '0 auto', color:'rgb(112, 184, 111)', fontSize:'25px', fontWeight:'bold'}}> Изменения сохранены!</div>
                    }
                </div>
                
            //</form>
        )
    }
}

export default CompanyRegistration