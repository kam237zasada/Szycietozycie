import React from 'react';
import { connect } from 'react-redux';
import { addColor, getColor, updateColor, deleteColor } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie} from '../../js/index';

class ColorForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            error: '',
            update: false
        }
    }

    componentDidMount = async () => {
        const jwt = getCookie("jwt")
        if(this.props.match.params.id) {
            await this.props.getColor(this.props.match.params.id, jwt)
            this.setState({_id: this.props.color._id})
            this.setState({name: this.props.color.name})
            this.setState({update: true})
            }
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            default:
                break;
        }
    };

    handleUpdate = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt");
        try {
        await this.props.updateColor(this.state._id, this.state.name, jwt)
        this.setState({isAdded: true});
        }
        catch(err) {
            return this.setState({error: err.response.data})
        }
    }

    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt");
        try {
        await this.props.deleteColor(this.state._id, jwt)
        this.setState({isAdded: true});
        }
        catch(err) {
            return this.setState({error: err.response.data})
        }
    }

    handleSubmit = async event => {

        event.preventDefault();
        const jwt = getCookie("jwt")
        try {
        const {name} = this.state;
        await this.props.addColor(name, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="addColor">
                    {this.state.update ? <label>Edytuj kolor:</label> : <label>Dodaj nowy kolor:</label>}
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div><div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    {this.state.update ? 
                    <><button className="panel-button" form="addColor" onClick={this.handleUpdate}>Edytuj</button>
                    <button className="panel-button" form="addColor" onClick={this.handleDelete}>Usuń</button></> :
                    <button className="panel-button" form="addColor" onClick={this.handleSubmit}>Dodaj</button>
                    }

                </form>
            </div>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/colors"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { color: state.color };

};

export default connect(
    mapStateToProps,
    { addColor, getColor, updateColor, deleteColor }
    )(ColorForm);