import React from 'react';
import { connect } from 'react-redux';
import { addShipment } from '../../actions';
import { Redirect } from 'react-router-dom';

class NewShipmentForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            price: ''
        }
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'price':
                this.setState({ price: event.target.value });
                break;
            default:
                break;
        }
    };

    handleSubmit = async event => {
        event.preventDefault();
        const {name, price} = this.state;
        await this.props.addShipment(name, price);
        this.setState({isAdded: true});
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="addShipment">
                    <label>Dodaj nową metodę płatności:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div>
                    <div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        placeholder=""
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Cena</label>
                        <input
                        type="text"
                        name="price"
                        placeholder=""
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <button className="panel-button" form="addShipment" onClick={this.handleSubmit}>Dodaj</button>
                </form>
            </div>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/dostawy"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { shipment: state.shipment };

};

export default connect(
    mapStateToProps,
    { addShipment }
    )(NewShipmentForm);