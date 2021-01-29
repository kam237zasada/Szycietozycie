import React from 'react';
import { connect } from 'react-redux';
import { passwordReminder } from '../actions';
import ShopMenu from './ShopMenu';

class PasswordReminder  extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            email: '',
            isSubmit: false,
            success: '',
            error: ''
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        if(this.state.email=="") {
            return this.setState({error: "Musisz podać adres email"})
        }
        this.setState({error:''})
        this.setState({success:''})
        try {
        const { email } = this.state;
        await this.props.passwordReminder(email);
        this.setState({success: this.props.customer})
        this.setState({isSubmit: true}); }

        catch (err) {
            this.setState({error: err.response.data})
        }
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'email':
                this.setState({ email: event.target.value });
                break;
            default:
                break;
        }
    };
    

    render() {

        return(
            <div className="shop-content"><ShopMenu/>
                <div className="ui form customer-form">
                <form id="passwordRemember">
                    <div className="customer-form-container"><div className="shop-form-header">Podaj adres email:</div>
                    <div className="field">
                        <label>Email</label>
                        <input
                        type="text"
                        name="email"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <button className="button-basket" form="passwordRemember" onClick={this.handleSubmit}>Zresetuj hasło</button>
                    {this.state.error}
                    {this.state.success}
                    </div>
                </form>
                
            </div>            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { customer: state.customer };

};

export default connect(
    mapStateToProps,
    { passwordReminder }
    )(PasswordReminder);