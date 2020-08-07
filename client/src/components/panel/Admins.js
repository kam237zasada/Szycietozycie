import React from 'react';
import { getAdmins, deleteAdmin } from '../../actions';
import { connect } from 'react-redux';
import { getCookie } from '../../js/index';


class Admins extends React.Component {
    constructor(props) {
        super(props);
         this.state = {admins: [], password:'', deleteError:''}
    }
    async componentDidMount() {
        const jwt = getCookie("jwt")
       await this.props.getAdmins(jwt);
       this.setState({admins: this.props.admins})
    }

    handleChange = e => {
        switch(e.target.name) {
            case 'delete-confirmation-password':
            this.setState({password: e.target.value})
            break;
            default:
                break;
        }
    }

    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt");
        try {
        await this.props.deleteAdmin(e.target.id, this.state.password, jwt)
        } catch(err) {
            this.setState({deleteError: err.response.data})
        }
    }

    handleCloseConf = e => {
        e.preventDefault();
        let container = document.getElementById("password-container");
        container.remove();
    }

    handleConfirmation = e => {
        e.preventDefault();
        let root = document.getElementById("root");
        let container = document.createElement("div");
        container.setAttribute("id", "password-container");
        let X = document.createElement("button");
        X.setAttribute("class", "question-form-close")
        X.innerHTML="zamknij <b>X</b>"
        X.addEventListener("click", this.handleCloseConf)
        container.appendChild(X);
        let p = document.createElement("p");
        p.innerText="Podaj SWOJE hasło w celu autoryzacji"
        let input = document.createElement("input");
        input.setAttribute("type", "password");
        input.setAttribute("name", "delete-confirmation-password");
        input.setAttribute("class", "password-confirmation-input")
        input.addEventListener("change", this.handleChange)
        let button = document.createElement("button");
        button.setAttribute("class", "panel-button")
        button.innerText = "USUŃ"
        button.addEventListener("click", this.handleDelete)
        button.setAttribute("id", e.target.id)
        root.appendChild(container);
        container.appendChild(p)
        container.appendChild(input);
        container.appendChild(button)

    }

    renderAdmins = () => {
        return this.state.admins.map( admin => {
            let adminId = getCookie("adminId")
            if(admin._id===adminId) {
                return (
                    <tr>
                        <td data-label="Imię i nazwisko"><a href={`/admin/admins/${admin._id}`}>{admin.name}</a></td>
                        <td data-label="Email">{admin.email}</td>
                        <td data-label="Akcje">
                            <a href={`/admin/admins/${admin._id}`}><button className="panel-button">EDYTUJ</button></a>
                            </td>
                    </tr>
                )
            } else {
            return (
                <tr>
                    <td data-label="Imię i nazwisko"><a href={`/admin/admins/${admin._id}`}>{admin.name}</a></td>
                    <td data-label="Email">{admin.email}</td>
                    <td data-label="Akcje">
                        <a href={`/admin/admins/${admin._id}`}><button className="panel-button">EDYTUJ</button></a>
                        <button id={admin._id} onClick={this.handleConfirmation} className="panel-button">USUŃ</button>
                        </td>
                </tr>
            )
            }
                })
            }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/admins/add"}><button className="panel-button">+ dodaj administratora</button></a>
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Imię i nazwisko</th>
            <th>Email</th>
            <th>Akcje</th>
            </tr></thead>
            <tbody>
                {this.renderAdmins()}
            </tbody>
            </table>
            {this.state.deleteError}
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { admins: state.admins, admin: state.admin };
};
export default connect(
    mapStateToProps,
    { getAdmins, deleteAdmin }
)(Admins);