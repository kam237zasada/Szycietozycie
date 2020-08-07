import React from 'react';
import { getDiscounts } from '../../actions';
import { connect } from 'react-redux';
import { getCookie } from '../../js/index';


class Discounts extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            discounts:[],
            loaded: false
        }
    }
    async componentDidMount() {
        const jwt = getCookie("jwt")
       await this.props.getDiscounts(jwt);
       this.setState({discounts: this.props.discounts})
       this.setState({loaded: true})
    }

    renderDiscounts() {
        return this.state.discounts.map(discount => {
            if(discount.active===true) {
            return (
                <tr>
                    <td data-label="Nazwa"><a href={`/admin/discounts/edit/${discount.ID}`}>{discount.name}</a></td>
                    <td data-label="Kod">{discount.code}</td>
                    <td data-label="Rabat">{discount.value}</td>
                    <td data-label="Aktywny">TAK</td>
                </tr>
        )
            } else {
                return (
                    <tr>
                        <td data-label="Nazwa"><a href={`/admin/discounts/edit/${discount.ID}`}>{discount.name}</a></td>
                        <td data-label="Kod">{discount.code}</td>
                        <td data-label="Rabat">{discount.value}</td>
                        <td data-label="Aktywny">NIE</td>
                    </tr>
            )
            }
     }
        )
    }
    render() {

        const renderTable = (
            <><div className="products-navigation-header">
                <a href={"/admin/discounts/add"}><button className="panel-button">+ dodaj kod rabatowy</button></a>
                </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr>
                <th>Nazwa</th>
                <th>Kod</th>
                <th>Rabat</th>
                <th>Aktywny</th>
            </tr></thead>
            <tbody>
            {this.renderDiscounts()}
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
    return { discounts: state.discounts };
};
export default connect(
    mapStateToProps,
    { getDiscounts }
)(Discounts);