import React from 'react';
import { connect } from 'react-redux';
import { getShipment, updateShipment, deleteShipment } from '../../actions';
import { Redirect } from 'react-router-dom';

class UpdateShipmentForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            price: '',
            isUpdated: false,
            isDeleted: false,
            error: ''
        }
    }

    componentDidMount = async () => {
        await this.props.getShipment(this.props.match.params.id);
        this.setState({name: this.props.shipment.name})
        this.setState({price: this.props.shipment.price});
        this.setState({_id: this.props.shipment._id})
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'price':
                this.setState({price: event.target.value});
            default:
                break;
        }
    };

    handleUpdate = async (e) => {
        e.preventDefault();
        try {
        const {_id, name, price} = this.state;
        await this.props.updateShipment(_id, name, price);
        this.setState({isUpdated: true});
        } catch (err) {
            this.setState({error: err.response.data});
        }
    }
    handleDelete = async e => {
        e.preventDefault();
        await this.props.deleteShipment(this.state._id);
        this.setState({isDeleted: true});
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="editShipment">
                    <label>Edytuj formę dostawy:</label>
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
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    <button className="panel-button" form="editShipment" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button>
                </form>
            </div>
        )
        return <div>{this.state.isUpdated || this.state.isDeleted ? <Redirect push to="/admin/dostawy"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { shipment: state.shipment };

};

export default connect(
    mapStateToProps,
    { getShipment, deleteShipment, updateShipment }
    )(UpdateShipmentForm);