import React from 'react';
import { connect } from 'react-redux';
import { getDiscount, addDiscount, updateDiscount, deleteDiscount } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js/index';

class DiscountForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            code: '',
            type: '',
            value: 0,
            isInfinite: true,
            isSingleUse: false, 
            isSingleByUser: false,
            active: true,
            mustLogin: false, 
            update: false,
            loaded: false
        }
    }

    componentDidMount = async () => {
        const jwt = getCookie("jwt")
        if(this.props.match.params.id) {
            await this.props.getDiscount(this.props.match.params.id, jwt);
            this.setState({_id: this.props.discount._id})
        this.setState({name: this.props.discount.name})
        this.setState({code: this.props.discount.code});
        this.setState({type: this.props.discount.type});
        this.setState({value: this.props.discount.value})
        this.setState({isInfinite: this.props.discount.isInfinite})
        this.setState({isSingleUse: this.props.discount.isSingleUse})
        this.setState({isSingleByUser: this.props.discount.isSingleByUser})
        this.setState({active: this.props.discount.active})
        this.setState({mustLogin: this.props.discount.mustLogin})
        this.setState({update: true})
        }
        this.setState({loaded: true})
        if(this.state.isSingleByUser) {
            let el = document.getElementById("login-input")
            el.setAttribute("disabled", "true");
        }


    }
    handleChange = async event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'code':
                this.setState({ code: event.target.value });
                break;
            case 'type':
                this.setState({ type: event.target.value});
                break;
            case 'value':
                this.setState({ value: event.target.value});
                break;
            case 'limit':
                let el = document.getElementById("login-input")
                if(event.target.attributes.limitvalue.value==='isInfinite') {
                    this.setState({isInfinite: true})
                        this.setState({isSingleUse: false})
                        this.setState({isSingleByUser: false})
                        console.log("abc")
                        el.removeAttribute("disabled");
                } else if(event.target.attributes.limitvalue.value==="isSingleUse") {
                    this.setState({isInfinite: false})
                        this.setState({isSingleUse: true})
                        this.setState({isSingleByUser: false})
                        el.removeAttribute("disabled");
                } else {
                    this.setState({isInfinite: false})
                        this.setState({isSingleUse: false})
                        this.setState({isSingleByUser: true})
                        this.setState({mustLogin: true})
                        el.setAttribute("disabled", "true");
                }
                break;
            case 'mustLogin':
                if(event.target.checked) {
                    this.setState({mustLogin: true})
                } else {
                    this.setState({mustLogin: false})
                }
            break;
            case 'active':
                if(event.target.checked) {
                    this.setState({active: true})
                } else {
                    this.setState({active: false})
                }
            break;
            default:
                break;
        }
    };

    handleUpdate = async (e) => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        const {_id, name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin} = this.state;
            try {
        await this.props.updateDiscount(_id, name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: "Coś poszło nie tak"});
        } 
    }
    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        await this.props.deleteDiscount(this.state._id, jwt);
        this.setState({isAdded: true});
    }

    handleSubmit = async event => {
        event.preventDefault();
        const jwt = getCookie("jwt")
        try {
        const {name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin} = this.state;
        await this.props.addDiscount(name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }


    renderLimits = () => {

        if(this.state.isInfinite) {
            return (
                <><input
                type="radio"
                name="limit"
                limitvalue="isInfinite"
                onChange={this.handleChange}
                checked/><label>Bez limitów</label>
                <input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isSingleUse"
                /><label>Można wykorzystać tylko raz</label>
                <input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isSingleByUser"
                /><label>Każdy użytkownik może wykorzystać tylko raz</label></>
            )
        } else if(this.state.isSingleUse) {
            return (
                <><input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isInfinite"
                /><label>Bez limitów</label>
                <input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isSingleUse"
                checked/><label>Można wykorzystać tylko raz</label>
                <input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isSingleByUser"
                /><label>Każdy użytkownik może wykorzystać tylko raz</label></>
            )
        }
        else if(this.state.isSingleByUser) {
            return (
                <><input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isInfinite"
                /><label>Bez limitów</label>
                <input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isSingleUse"
                /><label>Można wykorzystać tylko raz</label>
                <input
                type="radio"
                name="limit"
                onChange={this.handleChange}
                limitvalue="isSingleByUser"
                checked/><label>Każdy użytkownik może wykorzystać tylko raz</label></>
            )
        } else {
                return (
                    <><input
                    type="radio"
                    name="limit"
                    onChange={this.handleChange}
                    limitvalue="isInfinite"
                    /><label>Bez limitów</label>
                    <input
                    type="radio"
                    name="limit"
                    onChange={this.handleChange}
                    limitvalue="isSingleUse"
                    /><label>Można wykorzystać tylko raz</label>
                    <input
                    type="radio"
                    name="limit"
                    onChange={this.handleChange}
                    limitvalue="isSingleByUser"
                    /><label>Każdy użytkownik może wykorzystać tylko raz</label></>
                )
        }
    }

    renderTypes = () => {
        let types = ["Procent", "Kwota"];

        return types.map( type => {
            if(this.state.type===type) {
                return <option value={type} selected>{type}</option>
            }
            else {
                return <option value={type}>{type}</option>
            }
        })
    }
    render() {
 
        const renderForm = (
            <div className="ui form">
                <form id="discountShipment">
                    {this.state.update ? <label>Edytuj Kod rabatowy</label> : <label>Dodaj nowy kod rabatowy:</label>}
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div>
                    <div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Kod</label>
                        <input
                        type="text"
                        name="code"
                        value={this.state.code}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Typ rabatu</label>
                        <select name="type" onChange={this.handleChange}>
                            <option value="">Wybierz typ z listy</option>
                            {this.renderTypes()}
                        </select>
                    </div>
                    <div className="field">
                        <label>Wartość</label>
                        <input
                        type="text"
                        name="value"
                        value={this.state.value}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Limit wykorzystań</label>
                            {this.renderLimits()}
                    </div>
                    <div className="field">
                        <label>Wymagane logowanie</label>
                        {this.state.mustLogin ? <input
                        id="login-input"
                        type="checkbox"
                        name="mustLogin"
                        onChange={this.handleChange}
                        checked></input> : <input
                        id="login-input"
                        type="checkbox"
                        name="mustLogin"
                        onChange={this.handleChange}
                        ></input>}
                    </div>
                    <div className="field">
                        <label>Aktywność</label>
                        {this.state.active ? <input
                        type="checkbox"
                        name="active"
                        onChange={this.handleChange}
                        checked></input> : <input
                        type="checkbox"
                        name="active"
                        onChange={this.handleChange}
                        ></input>}
                    </div>
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    {this.state.update ? <><button className="panel-button" form="discountShipment" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button></>
 : <button className="panel-button" form="discountShipment" onClick={this.handleSubmit}>Dodaj</button>}
                </form>
            </div>

            
        )

        const isLoading = (
            <div>Wczytywanie...</div>
        )

        const loading = (
                <>{this.state.loaded ? renderForm : isLoading}</>
            )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/discounts"/> : loading}</div>

    }
}

const mapStateToProps = (state) => {
    return { discount: state.discount };

};

export default connect(
    mapStateToProps,
    { getDiscount, addDiscount, updateDiscount, deleteDiscount }
    )(DiscountForm);