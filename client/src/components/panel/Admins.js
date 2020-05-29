import React from 'react';
import { getAdmins } from '../../actions';
import { connect } from 'react-redux';

function AdminItem({admin}) {


    return (
        <tr>
            <td data-label="Nazwa">{admin.name}</td>
            <td data-label="Nazwa">{admin.email}</td>
            <td data-label="Akcje"><button className="panel-button">EDYTUJ</button></td>
        </tr>
    )
}

function AdminsTable({admins}) {
    return admins.map( admin => <AdminItem admin={admin} key={admin._id}/>)
   }

class Admins extends React.Component {
    constructor(props) {
        super(props);
         this.state = {_id: '', name: '', email:''}
    }
    async componentDidMount() {
       await this.props.getAdmins();
    }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/administratorzy/dodaj"}><button className="panel-button">+ dodaj administratora</button></a>
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
            <AdminsTable admins={this.props.admins}/>
            </tbody>
            </table>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { admins: state.admins };
};
export default connect(
    mapStateToProps,
    { getAdmins }
)(Admins);