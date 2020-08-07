import React from 'react';
import { connect } from 'react-redux';
import { addShipment, getShipment, updateShipment, deleteShipment, getPayments } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js/index';

class NewShipmentForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            price: '',
            freeShipment: '',
            payments: [],
            checkedPayments: [],
            error:'',
            update: false,
            loaded: false
        }
    }

    componentDidMount = async () => {
        await this.props.getPayments();
        this.setState({payments: this.props.payments})
        if(this.props.match.params.id) {
            await this.props.getShipment(this.props.match.params.id);
        this.setState({name: this.props.shipment.name})
        this.setState({price: this.props.shipment.price});
        this.setState({freeShipment: this.props.shipment.freeShipment});
        this.setState({_id: this.props.shipment._id})
        this.setState({update: true})
        this.setState({checkedPayments: this.props.shipment.payments})
        }
        this.setState({loaded: true})

    }
    handleChange = async event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'price':
                this.setState({ price: event.target.value });
                break;
            case 'isFree':
                if(event.target.checked===true) {
                    this.setState({freeShipment: ''})
                } else {
                    this.setState({freeShipment: '150'})
                }
                break;
            case 'freeShipment':
                this.setState({freeShipment: event.target.value})
                break;
            case 'payment':
                let payments = this.state.checkedPayments;
                if(event.target.checked===true) {
                    payments.push({name: event.target.attributes.payment.value, _id: event.target.id, additionalCost:0})
                } else {
                    payments.map((payment, index)=> {
                        if(payment._id===event.target.id) {
                            payments.splice(index, 1)
                        }
                    })
                }
                await this.setState({checkedPayments: payments})
                break;
            case 'additionalCost':
                if(!isNaN(event.target.value)) {
                let x = this.state.checkedPayments;
                for(let i =0; i<x.length;i++) {
                    if(event.target.attributes.payment.value==x[i]._id) {
                        x[i].additionalCost=event.target.value;
                    }
                }
                await this.setState({checkedPayments: x})
            }
                break;
            default:
                break;
        }
    };

    handleUpdate = async (e) => {
        e.preventDefault();
        const jwt = getCookie("jwt");
        const {_id, name, price, freeShipment, checkedPayments} = this.state;
        
            try {
        await this.props.updateShipment(_id, name, price, freeShipment, checkedPayments, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: "Coś poszło nie tak"});
        } 
    }
    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt");
        await this.props.deleteShipment(this.state._id, jwt);
        this.setState({isAdded: true});
    }

    handleSubmit = async event => {
        event.preventDefault();
        const jwt = getCookie("jwt");
        try {
        const {name, price, freeShipment, checkedPayments} = this.state;
        await this.props.addShipment(name, price, freeShipment, checkedPayments, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }

    renderPayments() {
        return this.state.payments.map( payment => {
            let check = false;
            for(let i =0;i<this.state.checkedPayments.length;i++) {
                if(this.state.checkedPayments[i]._id==payment._id) {
                    check = true
                }
            }
            if(check) {
                console.log(this.state.checkedPayments)
                let x = this.state.checkedPayments;
                let cost;
                for(let i=0; i<x.length;i++) {
                    if(payment._id==x[i]._id) {
                        cost = x[i].additionalCost;
                    }
                }
                return (
                    <><label><input
                    type="checkbox"
                    name="payment"
                    payment={payment.name}
                    onChange={this.handleChange}
                    id={payment._id}
                    checked
                    />{payment.name}</label>
                    <label>Dodatkowy koszt dostawy
                        <input
                        type="text"
                        name="additionalCost"
                        payment={payment._id}
                        value={cost}
                        onChange={this.handleChange}
                        />
                        </label></>

                )
            }
                return (
                    <label><input
                    type="checkbox"
                    name="payment"
                    payment={payment.name}
                    onChange={this.handleChange}
                    id={payment._id}
                    />{payment.name}</label>
                )
        })
    }
    render() {
        const isFree = (
            <><label><input
            type="checkbox"
            name="isFree"
            onChange={this.handleChange}
            />Brak darmowej dostawy</label>
            <input
            type="text"
            name="freeShipment"
            value={this.state.freeShipment}
            onChange={this.handleChange}
            required></input></>
        )   
        
        const noFree = (
            <label><input
            type="checkbox"
            name="isFree"
            onChange={this.handleChange}
            checked
            />Brak darmowej dostawy</label>
            
        )
 
        const renderForm = (
            <div className="ui form">
                <form id="formShipment">
                    {this.state.update ? <label>Edytuj formę płatności</label> : <label>Dodaj nową metodę płatności:</label>}
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
                        <label>Cena</label>
                        <input
                        type="text"
                        name="price"
                        value={this.state.price}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Darmowa dostawa</label>
                        {this.state.freeShipment=="" ? noFree : isFree}
                    </div>
                    <div className="field">
                        <label>Metody płatności dostępne dla dostawy</label>
                        {this.renderPayments()}
                    </div>
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    {this.state.update ? <><button className="panel-button" form="formShipment" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button></>
 : <button className="panel-button" form="formShipment" onClick={this.handleSubmit}>Dodaj</button>}
                </form>
            </div>

            
        )

        const isLoading = (
            <div>Wczytywanie...</div>
        )

        const loading = (
                <>{this.state.loaded ? renderForm : isLoading}</>
            )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/dostawy"/> : loading}</div>

    }
}

const mapStateToProps = (state) => {
    return { shipment: state.shipment, payments: state.payments };

};

export default connect(
    mapStateToProps,
    { addShipment, getShipment, updateShipment, deleteShipment, getPayments }
    )(NewShipmentForm);