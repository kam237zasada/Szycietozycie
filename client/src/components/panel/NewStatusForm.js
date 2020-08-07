import React from 'react';
import { connect } from 'react-redux';
import { addStatus, getStatus, updateStatus, deleteStatus } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js/index';

class NewStatusForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            type: '',
            isDefault: false,
            update: false,
            isAdded: false,
            loaded: false,
            error: '',
            default: false
        }
    }

    componentDidMount = async () => {
        const jwt = getCookie("jwt");
        if(this.props.match.params.id) {
        await this.props.getStatus(this.props.match.params.id, jwt);
        this.setState({name: this.props.status.name});
        this.setState({_id: this.props.status._id});
        this.setState({type: this.props.status.type});
        this.setState({isDefault: this.props.status.isDefault});
        if(this.props.status.isDefault) {
            this.setState({default: true})
        }
        this.setState({update: true});
        }
        this.setState({loaded: true})
    }

    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'type':
                this.setState({ type: event.target.value});
                break;
            case 'isDefault':
                if(event.target.checked) {
                    this.setState({ isDefault: true})
                } else { this.setState({isDefault: false})}
            default:
                break;
        }
    };

    handleSubmit = async event => {
        event.preventDefault();
        const jwt = getCookie("jwt")

        try {
        const {name, type, isDefault} = this.state;
        await this.props.addStatus(name, type, isDefault, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }

    handleUpdate = async (e) => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        const {_id, name, type, isDefault} = this.state;
        try {
        await this.props.updateStatus(_id, name, type, isDefault, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }
    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        try {
        await this.props.deleteStatus(this.state._id, jwt);
        this.setState({isAdded: true});
        } catch(err) {
            this.setState({error: err.response.data})
        }
    }
    renderTypes() {
        let types = ["Nowe", "Otwarte", "Zakończone"];
        return types.map(element => {
            if(element===this.state.type) {
                return <option value={element} selected>{element}</option>
            } else {
                return <option value={element}>{element}</option>
            }
        })
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="addStatus">
                    {this.state.update ? <label>Edytuj status zamówienia:</label> : <label>Dodaj nowy status zamówienia:</label>}
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
                        <label>Typ</label>
                        <select
                        name="type"
                        onChange={this.handleChange}
                        required>
                            <option value="">Wybierz z listy</option>
                            {this.renderTypes()}
                        </select>
                    </div>
                    {this.state.update ? <div className="field">
                        <label>Ustaw jako domyślny</label>
                        {this.state.default ? <input
                        type="checkbox"
                        name="isDefault"
                        onChange={this.handleChange}  
                        checked 
                        disabled                
                        /> : <input
                        type="checkbox"
                        name="isDefault"
                        onChange={this.handleChange}                    
                        />}
                    </div> : null}
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    {this.state.update ? 
                    <><button className="panel-button" form="editStatus" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button></>
                    : <button className="panel-button" form="addStatus" onClick={this.handleSubmit}>Dodaj</button>}
                </form>
            </div>
        )
        const loading = (
            <>{this.state.loaded ? renderForm : <div>Wczytywanie...</div>}</>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/statuses"/> : loading}</div>

    }
}

const mapStateToProps = (state) => {
    return { status: state.status };

};

export default connect(
    mapStateToProps,
    { addStatus, getStatus, updateStatus, deleteStatus }
    )(NewStatusForm);