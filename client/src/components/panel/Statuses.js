import React from 'react';
import { getStatuses } from '../../actions';
import { connect } from 'react-redux';



function StatusesTable({statuses}) {
    return statuses.map( status => {
        return (
            <tr>
                <td data-label="Nazwa"><a href={`/admin/statusy/${status.ID}`}>{status.name}</a></td>
            </tr>
        )
    }
    )
   }

class Statuses extends React.Component {
    constructor(props) {
        super(props);
    }
    async componentDidMount() {
       await this.props.getStatuses();
    }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/statusy/dodaj"}><button className="panel-button">+ dodaj status</button></a>
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Nazwa</th>
            </tr></thead>
            <tbody>
            <StatusesTable statuses={this.props.statuses}/>
            </tbody>
            </table>
            </div>            
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