import React from 'react';
import { getShipments } from '../../actions';
import { connect } from 'react-redux';

function ShipmentItem({shipment}) {


    return (
        <tr>
            <td data-label="Nazwa"><a href={`/admin/dostawy/${shipment.ID}`}>{shipment.name}</a></td>
            <td data-label="Cena">{shipment.price}</td>
        </tr>
    )
}

function ShipmentsTable({shipments}) {
    return shipments.map( shipment => <ShipmentItem shipment={shipment} key={shipment._id}/>)
   }

class Shipments extends React.Component {
    constructor(props) {
        super(props);
         this.state = {_id: '', name: ''}
    }
    async componentDidMount() {
       await this.props.getShipments();
    }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/dostawy/dodaj"}><button className="panel-button">+ dodaj metodę dostawy</button></a>
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Nazwa</th>
            <th>Cena</th>
            </tr></thead>
            <tbody>
            <ShipmentsTable shipments={this.props.shipments}/>
            </tbody>
            </table>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { shipments: state.shipments };
};
export default connect(
    mapStateToProps,
    { getShipments }
)(Shipments);