import React from 'react'
import Aux from '../../../hoc/Aux/Aux'

import Button from '../../UI/BackDrop/Button/Button'

const orderSummery = (props) => {
    const ingredientSummery = Object.keys(props.ingredients).map(igKey => {
        return <li key={igKey}>
            <strong><span style={{textTransform : 'capitalize'}}>{igKey}</span></strong> : {props.ingredients[igKey]}
         </li>
    });

    return (
        <Aux>
            <h3>Order Summery</h3> 
            <p>Your Delicious Burger with the below Ingredients :</p>
            <ul>
                {ingredientSummery}
            </ul>
            <p><strong>Total Price : </strong>{props.totalAmount.toFixed(2)}</p>
            <p>Continue to Checkout ? </p>
            <Button btnType='Danger' clicked={props.purchaseCancel}>CANCEL</Button>
            <Button btnType='Success' clicked={props.purchaseContinue}>CONTINUE</Button>
        </Aux>
        )
    }

export default orderSummery;