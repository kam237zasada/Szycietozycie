import React from 'react';
import { connect } from 'react-redux';
import { newPassword } from '../actions';
import { Redirect } from 'react-router-dom';
import ShopMenu from './ShopMenu';
import { baseURL } from '../api/index'

class NewPassword  extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            password: '',
            repeatPassword: '',
            isSubmit: false,
            success: '',
            error: ''
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({error:''})
        this.setState({success:''})
        if(this.state.password=="" || this.state.repeatPassword=="") { return this.setState({error: "Żadne pole nie może być puste"})}
        if(this.state.password!=this.state.repeatPassword) { return this.setState({error: "Hasła muszą być identyczne!"})}
        try {
        const { password } = this.state;
        await this.props.newPassword(this.props.match.params.id, password, this.props.match.params.token);
        this.setState({success: this.props.customer})
        this.setState({isSubmit: true}); }

        catch (err) {
            this.setState({error: err.response.data})
        }
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'password':
                this.setState({ password: event.target.value });
                break;
            case 'repeatPassword':
                this.setState({ repeatPassword: event.target.value });
                break;
            default:
                break;
        }
    };
    

    render() {

        return(
            <div className="shop-content"><ShopMenu/>
                <div className="ui form customer-form">
                <form id="passwordNew">
                    <div className="customer-form-container"><div className="shop-form-header">Zmień hasło:</div>
                    <div className="field">
                        <label>Podaj nowe hasło</label>
                        <input
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Powtórz nowe hasło</label>
                        <input
                        type="password"
                        name="repeatPassword"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <input type="submit" value="Zmień hasło" className="button-basket" form="passwordNew" onClick={this.handleSubmit}></input>
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
    { newPassword }
    )(NewPassword);