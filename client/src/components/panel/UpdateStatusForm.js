import React from 'react';
import { connect } from 'react-redux';
import { getStatus, updateStatus, deleteStatus } from '../../actions';
import { Redirect } from 'react-router-dom';

class UpdateStatusForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            isUpdated: false,
            isDeleted: false
        }
    }

    componentDidMount = async () => {
        await this.props.getStatus(this.props.match.params.id);
        this.setState({name: this.props.status.name})
        this.setState({_id: this.props.status._id})
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

    handleUpdate = async (e) => {
        e.preventDefault();
        const {_id, name} = this.state;
        await this.props.updateStatus(_id, name);
        this.setState({isUpdated: true});
    }
    handleDelete = async e => {
        e.preventDefault();
        await this.props.deleteStatus(this.state._id);
        this.setState({isDeleted: true});
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="editStatus">
                    <label>Edytuj Status zamówienia:</label>
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
                    </div>
                    <button className="panel-button" form="editStatus" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button>
                </form>
            </div>
        )
        return <div>{this.state.isUpdated || this.state.isDeleted ? <Redirect push to="/admin/statusy"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { status: state.status };

};

export default connect(
    mapStateToProps,
    { getStatus, deleteStatus, updateStatus }
    )(UpdateStatusForm);