import { useState, useContext } from 'react';
import OrderContext from './OrderContext';
import FormTextInput from './formTextInput';
import Button from './button';

const OrderIdLookup = () => {
  const { orderIdLookup } = useContext(OrderContext);
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');

  const lookup = e => {
    e.preventDefault();
    if (orderId != '') {
      orderIdLookup(orderId);
    } else {
      setMessage('Please enter a valid Order ID');
    }
  };

  return (
    <form className="sign-in">
      <FormTextInput label="Order Number" required name="orderId" id="orderNumber" required="true" helpLink helpLinkText="Can't Find It?" helpLinkPage="help" onChange={e => setOrderId(e.target.value)} />
      {message != '' && <div className="text-red-500 text-sm absolute mt-2">{message}</div>}
      <div className="mt-16">
        <Button label="Find Order" onClick={e => lookup(e)} />
      </div>
    </form>
  );
};

export default OrderIdLookup;