import React, { Component } from 'react';
import {connect} from 'react-redux';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { updateObject, checkValidity } from '../../../shared/utility';
import * as actionCreator from '../../../store/actions/index';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';


class ContactData extends Component {
    state = {
        orderForm: {
            inputName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "Your name"
                },
                value: '',
                validation: {
                    required: true
                },
                valid:false,
                touched:false
            },
            inputEmail: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "Your email"
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid:false,
                touched:false
            },
            inputStreet: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "Street"
                },
                value: '',
                validation: {
                    required: true
                },
                valid:false,
                touched:false
            },

            inputZipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: "Postal code"
                },
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                value: '',
                valid:false,
                touched:false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    type: 'select',
                    options: ['fastest', 'cheapest']
                },
                value:'fastest',
                validation: {},
                valid: true

            }
        },
        formValid:false

    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData={};
        for(let key in this.state.orderForm){
            formData[key]=this.state.orderForm[key].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            formData,
            userId:this.props.userId

        }

        this.props.onBurgerPurchasing(order,this.props.token);
    }

    inputChangedHandler = (event, id) => {
        const updatedFormElement = updateObject(this.state.orderForm[id], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[id].validation),
            touched: true
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [id]: updatedFormElement
        });

        let formValid=true;

        for(let key in updatedOrderForm){
            if(!updatedOrderForm[key].valid){
                formValid=false;
            }
        }

        this.setState({orderForm: updatedOrderForm, formValid:formValid});
    }

    render() {

        let formInputs = [];
        for (let item in this.state.orderForm) {
            formInputs.push({
                id: item,
                config: this.state.orderForm[item]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formInputs.map((input) => (
                    <Input
                        inputtype={input.config.elementType}
                        elementConfig={input.config.elementConfig}
                        key={input.id}
                        value={input.config.value}
                        invalid={!input.config.valid}
                        touched = {input.config.touched}
                        changed={(event) => { return this.inputChangedHandler(event, input.id) }}
                    />))}
                <Button btnType="Success" disabled={!this.state.formValid}>ORDER</Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }
        return (<div className={classes.ContactData}>
            <h4>Enter your Contact Data</h4>
            {form}
        </div>
        )
    }


}

const mapStateToProps = state =>{
    return {
        ings:state.burger.ingredients,
        price:state.burger.totalPrice,
        loading:state.order.loading,
        token:state.auth.token,
        userId:state.auth.userId
    };
};
const mapDispatchToProps = dispatch=>{
    return{
        onBurgerPurchasing:(orderData,token)=>dispatch(actionCreator.purchaseBurger(orderData,token))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler( ContactData,axios));