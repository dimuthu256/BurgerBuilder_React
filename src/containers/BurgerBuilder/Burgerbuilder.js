
import React , { Component } from 'react';
import Aux from '../../hoc/Aux/Aux'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummery from '../../components/Burger/OrderSummery/OrderSummery'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENTS_BASE_PRICE = {
    salad : 0.7,
    bacon : 1.7,
    cheese : 1.5,
    meat : 2.0
}

class BurgerBuilder extends Component{

    state = {
        ingredients : null,
        totalPrice : 10,
        purchasable : false,
        purchasing : false,
        loading : false,
        error : false        
    }

    componentDidMount () {
        axios.get('https://react-my-burger-d34aa.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients : response.data});
        })
        .catch(error => {
            console.log(error);
            this.setState({error : true});
        });
    }

    addIngredientHandler = (type) => {
        const oldCount  = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_BASE_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice : newPrice,ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        console.log('removed ingredients method')
        const oldCount  = this.state.ingredients[type];
        if (oldCount <= 0){
            return ;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENTS_BASE_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice : newPrice,ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    updatePurchaseState(ingredients) {
        // const ingredients = {
        //     ...this.state.ingredients 
        // }
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        },0);
        console.log("Purchasable : "+ sum);
        this.setState({purchasable : sum > 0});
    }

    purchasingHandler = () => {
        this.setState({purchasing : true})
    }

    purchasingCancelHandler = () => {
        this.setState({purchasing : false})
    }

    purchaseContinueHandler = () => {
        //alert("Purchase Continue ..!!!");
        this.setState({loading : true});
        const order = {
            ingredients : this.state.ingredients,
            price : this.state.totalPrice.toFixed(2),
            customer : {
                name : 'dimuthu',
                address : {
                    street : '121/1 Bibila Road',
                    zipCode : '70001',
                    country : 'Sri Lanka'
                },
                email : 'dnwnalaka@gmail.com',
                contact_number : 81177734
            },
            deleveryMethod : 'shipping'
        }
        
        axios.post('/orders.json', order)
                .then(response => {
                    console.log(response);
                    this.setState({loading : false, purchasing : false});
                })
                .catch(error => {
                    console.log(error);
                    this.setState({loading : false, purchasing : false});
                });
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
            console.log(disabledInfo[key]);
        }

        let orderSummery = null;
        let burger = this.state.error ? <h3>Error 500 : Sorry Page Cannot be Loaded.</h3> : <Spinner />;
     
        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls ingredientAdded={this.addIngredientHandler}
                                   ingredientRemoved={this.removeIngredientHandler}
                                   disabled={disabledInfo}
                                   purchasable = {this.state.purchasable}
                                   totalPrice={this.state.totalPrice}
                                   ordered = {this.purchasingHandler}/>
                </Aux>
            );

            orderSummery = <OrderSummery   ingredients={this.state.ingredients}
                            purchaseCancel={this.purchasingCancelHandler}
                            purchaseContinue={this.purchaseContinueHandler}
                            totalAmount={this.state.totalPrice}
                            />                
        }

        if(this.state.loading){
            orderSummery = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modelClosed={this.purchasingCancelHandler}>
                    {orderSummery}
                </Modal>
                {burger}
            </Aux>

        );
    }
}
export default withErrorHandler(BurgerBuilder , axios);