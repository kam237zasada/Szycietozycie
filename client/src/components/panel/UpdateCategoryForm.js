import React from 'react';
import { connect } from 'react-redux';
import { getCategory, updateCategory, deleteCategory } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js';

class UpdateCategoryForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            isUpdated: false,
            isDeleted: false,
            error: ''
        }
    }

    componentDidMount = async () => {
        await this.props.getCategory(this.props.match.params.id);
        this.setState({name: this.props.category.name})
        this.setState({_id: this.props.category._id})
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
        const jwt = getCookie('jwt');
        try {
        const {_id, name} = this.state;
        await this.props.updateCategory(_id, name, jwt);
        this.setState({isUpdated: true});
        } catch (err) { 
            this.setState({error: err.response.data})
        }
    }
    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie('jwt');
        await this.props.deleteCategory(this.state._id, jwt);
        this.setState({isDeleted: true});
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="editCategory">
                    <label>Edytuj kategorię:</label>
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
                    <button className="panel-button" form="editCategory" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button>
                </form>
            </div>
        )
        return <div>{this.state.isUpdated || this.state.isDeleted ? <Redirect push to="/admin/kategorie"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { category: state.category };

};

export default connect(
    mapStateToProps,
    { getCategory, deleteCategory, updateCategory }
    )(UpdateCategoryForm);