import React from 'react';
import { getPayments } from '../../actions';
import { connect } from 'react-redux';

function PaymentItem({payment}) {


    return (
        <tr>
            <td data-label="Nazwa"><a href={`/admin/platnosci/${payment.ID}`}>{payment.name}</a></td>
        </tr>
    )
}

function PaymentsTable({payments}) {
    return payments.map( payment => <PaymentItem payment={payment} key={payment._id}/>)
   }

class Payments extends React.Component {
    constructor(props) {
        super(props);
    }
    async componentDidMount() {
       await this.props.getPayments();
    }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/platnosci/dodaj"}><button className="panel-button">+ dodaj metodę płatności</button></a>
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Nazwa</th>
            </tr></thead>
            <tbody>
            <PaymentsTable payments={this.props.payments}/>
            </tbody>
            </table>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { payments: state.payments };
};
export default connect(
    mapStateToProps,
    { getPayments }
)(Payments);