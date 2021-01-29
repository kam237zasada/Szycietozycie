import React from 'react';
import { changeView } from '../js/index';


export function RenderShipments({shipmentSelected, shipments, selectedShipment}) {
    return shipments.map(shipment => {
        let newPrice = changeView(shipment.price)
        if(selectedShipment && selectedShipment.ID===shipment.ID) {
        return <div className="shipment-radio-button"><input onChange={shipmentSelected.bind(null, shipment)} type="radio" value={shipment.ID} name="shipment-method" checked></input><label>{shipment.name} <span style={{margin:'25px'}}>{newPrice} zł</span></label></div>
        } else {
         return <div className="shipment-radio-button"><input onChange={shipmentSelected.bind(null, shipment)} type="radio" value={shipment.ID} name="shipment-method"></input><label>{shipment.name} <span style={{margin:'25px'}}>{newPrice} zł</span></label></div>
        }
        
    }
    
    )
}