import React from 'react';

export function RenderPayments({paymentSelected, payments, selectedPayment}) {
    return payments.map(payment => {
        let cost = Number(payment.additionalCost)
        if(!isNaN(cost) && cost > 0) {
            if(selectedPayment && selectedPayment._id===payment._id) {

                return  <div className="shipment-radio-button"><input onChange={paymentSelected.bind(null, payment)} type="radio" value={payment.ID} name="payment-method" checked></input><label>{payment.name} + {cost} zł</label></div>
        } else {
            return  <div className="shipment-radio-button"><input onChange={paymentSelected.bind(null, payment)} type="radio" value={payment.ID} name="payment-method"></input><label>{payment.name}  + {cost} zł</label></div>
        }
        } else {
        if(selectedPayment && selectedPayment._id===payment._id) {

        return  <div className="shipment-radio-button"><input onChange={paymentSelected.bind(null, payment)} type="radio" value={payment.ID} name="payment-method" checked></input><label>{payment.name}</label></div>
} else {
    return  <div className="shipment-radio-button"><input onChange={paymentSelected.bind(null, payment)} type="radio" value={payment.ID} name="payment-method"></input><label>{payment.name}</label></div>
}
}
    }
    
    )
}