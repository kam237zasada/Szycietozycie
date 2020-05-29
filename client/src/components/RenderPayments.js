import React from 'react';
// import {getPayments} from '../actions';
// import { changeView } from '../js/index';
// import { connect } from 'react-redux';

// class RenderPayments extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             payments: []
//         }
//     }

//     componentDidMount = async () => {
//         await this.props.getPayments();
//         await this.setState({payments: this.props.payments});
//     }
//     render() {
//         console.log(this.state.payments);
        

// }
// }

// const mapStateToProps = state => {
//     return { payments: state.payments };
// };
// export default connect(
//     mapStateToProps,
//     { getPayments }
// )(RenderPayments);

export function RenderPayments({paymentSelected, payments, selectedPayment}) {
    return payments.map(payment => {
        if(selectedPayment && selectedPayment.ID===payment.ID) {

        return  <div className="shipment-radio-button"><input onChange={paymentSelected.bind(null, payment)} type="radio" value={payment.ID} name="payment-method" checked></input><label>{payment.name}</label></div>
} else {
    return  <div className="shipment-radio-button"><input onChange={paymentSelected.bind(null, payment)} type="radio" value={payment.ID} name="payment-method"></input><label>{payment.name}</label></div>
}
}
    
    )
}