import React, {Component} from 'react'
import styles from "./addDepartments.module.css"
const axios = require('axios');

class Department extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isEditable: true,
            icon: "/static/images/check-symbol.svg"
        }

        this.changeEditable = this.changeEditable.bind(this);
    }

    changeEditable() {
        const isEditable = this.state.isEditable
        this.setState({
            isEditable: !isEditable,
            icon: (!isEditable) ? "/static/images/check-symbol.svg" : "/static/images/edit.svg"
        })
    }

    render() {
        var prefix
        var inputs
        if (this.state.isEditable)
        {
            inputs = (<div className={styles.inputContainer}>
            <input value={this.props.department["city"]} onChange={(e) => this.props.handler(e, this.props.index, "city")} className={styles["city"]} placeholder={"Город"}/>
            <input value={this.props.department["street"]} onChange={(e) => this.props.handler(e, this.props.index, "street")} className={styles["street"]} placeholder={"Улица"}/>
            <input value={this.props.department["building"]} onChange={(e) => this.props.handler(e, this.props.index, "building")} className={styles["building"]} placeholder={"Здание"}/></div>)
            prefix = (this.props.index + 1).toString()
        }
        else
        {
            inputs = 'г. ' + this.props.department["city"] + ', ул. ' + this.props.department["street"] + ', д. ' + this.props.department["building"]
            prefix = 'Оделение ' + (this.props.index + 1).toString() + ': '
        }
        return(
            <li className={styles.department}>
                {prefix}
                {inputs}
                <img src={this.state.icon} className={styles.checkImg} onClick={this.changeEditable}/>
                <img src="/static/images/delete.svg" className={styles.deleteImg} onClick={e => this.props.deleteDepartment(e, this.props.index)}/>
            </li>
        )
    }
}

class AddDepartments extends Component{
    constructor(props) {
        super(props);
        this.state = {
            departments: this.props.departments
        }

        this.departmentInput = this.departmentInput.bind(this);
        this.addDepartment = this.addDepartment.bind(this);
        
        this.deleteDepartment = this.deleteDepartment.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    departmentInput(e, index, element) {
        var departments = this.state.departments.slice()
        departments[index][element] = e.target.value
        departments[index].isChanged = true
        this.setState({departments})
    }

    addDepartment() {
        var departments = this.state.departments
        var id = (departments.length > 0) ? departments[departments.length-1].id + 1 : 0 
        this.setState({
            departments: departments.concat([{
                isNew: true,
                id: id,
                city: '',
                street: '',
                building: ''
            }])
        })
    }

    deleteDepartment(e, index) {
        var departments = this.state.departments
        var deleted = departments.splice(index,1)[0]
        if (!deleted.isNew)
        {
            axios.delete('departments' + '?id=' + deleted.id)
            .then((response) => {
                console.log(response)
            })
            .catch(error => {
                console.log(error);
            })
        }

        this.setState({
            departments
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        this.state.departments.forEach(function callback(department, index, array) {
            console.log(department)
            var method
            var params = ''
            if(department.isNew)
                method = axios.post
            else if (department.isChanged)
            {
                method = axios.put
                params = '?id=' + department.id
            }
            else
                return
            method('departments' + params, department)
            .then((response) => {
                console.log(response)
            })
            .catch(error => {
                console.log(error);
            })
        })
    }

    render() {
        //console.log(this.props)
        const departments = this.state.departments.map((department, index) => 
            <Department key={department.id} department={department} handler={this.departmentInput} index={index} deleteDepartment={this.deleteDepartment}></Department>
        )
        
        return(
            <div className={styles.departments_conteiner}>
                <div style = {{ margin: '0 auto', width:'600px', position: 'relative'}} className={this.props.style}>
                    <ul className={styles.depUl}>
                    {departments}
                    </ul>
                    <div className={styles.addDepartment} onClick={this.addDepartment}>
                        <img className={styles.addImg} src="/static/images/add-button.svg" alt="add"/>
                        Добавить отделение
                    </div>
                    <div className={styles.border} onClick={this.handleSubmit}>
                        <input className={styles.button} type="submit" name="register" value="Сохранить изменения" style={{color: 'white'}}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddDepartments