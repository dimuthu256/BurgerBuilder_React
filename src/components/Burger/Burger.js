import React from 'react';
import classes from './Burger.css';
import BurgerIngredients from './BurgerIngredient/BurgerIngredient';

const burger =(props) => {

    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_,i) => {
                // console.log('***********igKey : '+igKey);
                // console.log('***********i :'+ i);
                return <BurgerIngredients key={igKey+i} type={igKey} />
            })
        }).reduce((arr,el)=>{
            return arr.concat(el);
        },[])
        // console.log(transformedIngredients);
    
    if (transformedIngredients.length === 0){
        transformedIngredients = <p>Please add Ingredients</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredients type='bread_top' />
            {transformedIngredients}
            {/* <BurgerIngredients type='cheese' />
            <BurgerIngredients type='meet' /> */}
            <BurgerIngredients type='bread_bottom' />

        </div>

        );
} 

export default burger;