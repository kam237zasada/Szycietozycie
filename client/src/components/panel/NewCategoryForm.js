import React from 'react';
import { connect } from 'react-redux';
import { addCategory } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js';

class NewCategoryForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            error: ''
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

    handleSubmit = async event => {
        event.preventDefault();
        const jwt = getCookie('jwt');
        try {
        const {name} = this.state;
        await this.props.addCategory(name, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="addCategory">
                    <label>Dodaj nową kategorię:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div><div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        placeholder=""
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    <button className="panel-button" form="addCategory" onClick={this.handleSubmit}>Dodaj</button>
                </form>
            </div>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/kategorie"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { category: state.category };

};

export default connect(
    mapStateToProps,
    { addCategory }
    )(NewCategoryForm);