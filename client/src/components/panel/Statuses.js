import React from 'react';
import { getStatuses } from '../../actions';
import { connect } from 'react-redux';
import {getCookie} from '../../js';


class Statuses extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            statuses:[],
            loaded: false
        }
    }
    async componentDidMount() {
        const jwt = getCookie("jwt")
       await this.props.getStatuses(jwt);
       this.setState({statuses: this.props.statuses})
       this.setState({loaded: true})
    }

    renderStatuses() {
        return this.state.statuses.map(status => {
            if(status.isDefault===true) {
            return (
                <tr>
                    <td data-label="Nazwa"><a href={`/admin/statuses/edit/${status.ID}`}>{status.name}</a></td>
                    <td data-label="Typ">{status.type}</td>
                    <td data-label="Domyslny">TAK</td>
                </tr>
        )
            } else {
                return (
                    <tr>
                        <td data-label="Nazwa"><a href={`/admin/statuses/edit/${status.ID}`}>{status.name}</a></td>
                        <td data-label="Typ">{status.type}</td>
                        <td data-label="Domyslny"></td>
                    </tr>
            )
            }
     }
        )
    }
    render() {

        const renderTable = (
            <><div className="products-navigation-header">
                <a href={"/admin/statuses/add"}><button className="panel-button">+ dodaj status</button></a>
                </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr>
                <th>Nazwa</th>
                <th>Typ</th>
                <th>Domyślny</th>
            </tr></thead>
            <tbody>
            {this.renderStatuses()}
            </tbody>
            </table>
            </div></>
        )
        const loading = (
            <div>Wczytywanie...</div>
        )
        return(
            <div className="content-container">
                   {this.state.loaded ? renderTable : loading}    
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { statuses: state.statuses };
};
export default connect(
    mapStateToProps,
    { getStatuses }
)(Statuses);