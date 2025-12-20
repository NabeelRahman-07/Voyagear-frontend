import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../../context/CartContext';
import { usePayment } from '../../context/PaymentContext';
import { AuthContext } from '../../context/AuthContext';

// Icons for payment methods
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaLock, FaTruck } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiGooglepay, SiPhonepe, SiPaytm } from 'react-icons/si';

function Payment() {
  const { cart } = useCart();
  const { placeOrder, calculateTotal, paymentLoading, paymentError } = usePayment();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const location=useLocation();
  const buyNow=location.state?.product;
  const quantity=location.state?.quantity;


 const items= buyNow?[{...buyNow,quantity:quantity}]:cart;

  // Calculate total
  const total = calculateTotal(items);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
      .required('Phone number is required'),
    street: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
      .required('Pincode is required'),
    upiId: Yup.string().when('paymentMethod', {
      is: 'UPI',
      then: Yup.string()
        .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, 'Invalid UPI ID')
        .required('UPI ID is required')
    }),
    cardNumber: Yup.string().when('paymentMethod', {
      is: 'CreditCard',
      then: Yup.string()
        .matches(/^[0-9]{16}$/, 'Card must be 16 digits')
        .required('Card number is required')
    }),
    expiry: Yup.string().when('paymentMethod', {
      is: 'CreditCard',
      then: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiry (MM/YY)')
        .required('Expiry date is required')
    }),
    cvv: Yup.string().when('paymentMethod', {
      is: 'CreditCard',
      then: Yup.string()
        .matches(/^[0-9]{3}$/, 'CVV must be 3 digits')
        .required('CVV is required')
    })
  });

  // Initial values
  const initialValues = {
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    upiId: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paymentMethod: 'COD'
  };

  // Handle payment submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const address = {
        name: values.name,
        phone: values.phone,
        street: values.street,
        city: values.city,
        state: values.state,
        pincode: values.pincode
      };

      const order = await placeOrder(items,paymentMethod, address);
      if (order) {
        alert(`✅ Order placed successfully!\nOrder ID: ${order.orderId}\nAmount: ₹${total}`);
        navigate('/orders');
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to complete your purchase</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-accent transition-colors"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Empty Cart</h2>
          <p className="text-gray-600 mb-6">Your cart is empty. Add items to proceed.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-accent transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your order in simple steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaTruck className="text-2xl text-secondary" />
                <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
              </div>
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting, setFieldValue }) => (
                  <Form className="space-y-6">
                    {/* Address Form Fields */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Field
                        name="name"
                        placeholder="Enter your full name"
                        className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                      {errors.name && touched.name && (
                        <div className="text-red-500 text-sm mt-2">{errors.name}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Field
                        name="phone"
                        placeholder="Enter 10-digit phone number"
                        className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                      {errors.phone && touched.phone && (
                        <div className="text-red-500 text-sm mt-2">{errors.phone}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Complete Address *
                      </label>
                      <Field
                        name="street"
                        as="textarea"
                        placeholder="House no., Street, Area"
                        rows="3"
                        className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                      />
                      {errors.street && touched.street && (
                        <div className="text-red-500 text-sm mt-2">{errors.street}</div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                        <Field
                          name="city"
                          placeholder="City"
                          className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        />
                        {errors.city && touched.city && (
                          <div className="text-red-500 text-sm mt-2">{errors.city}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                        <Field
                          name="state"
                          placeholder="State"
                          className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        />
                        {errors.state && touched.state && (
                          <div className="text-red-500 text-sm mt-2">{errors.state}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                        <Field
                          name="pincode"
                          placeholder="6-digit pincode"
                          className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        />
                        {errors.pincode && touched.pincode && (
                          <div className="text-red-500 text-sm mt-2">{errors.pincode}</div>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="pt-8 border-t">
                      <div className="flex items-center gap-3 mb-6">
                        <FaLock className="text-2xl text-secondary" />
                        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {/* COD Option */}
                        <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'COD'}
                            onChange={(e) => {
                              setPaymentMethod('COD');
                              setFieldValue('paymentMethod', 'COD');
                            }}
                            className="w-5 h-5 text-secondary mr-4"
                          />
                          <FaMoneyBillWave className="text-2xl text-gray-600 mr-4" />
                          <div className="flex-1">
                            <div className="font-bold text-lg">Cash on Delivery</div>
                            <div className="text-gray-600 mt-1">Pay when you receive the order</div>
                          </div>
                        </label>

                        {/* UPI Option */}
                        <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'UPI'}
                            onChange={(e) => {
                              setPaymentMethod('UPI');
                              setFieldValue('paymentMethod', 'UPI');
                            }}
                            className="w-5 h-5 text-secondary mr-4"
                          />
                          <FaMobileAlt className="text-2xl text-gray-600 mr-4" />
                          <div className="flex-1">
                            <div className="font-bold text-lg">UPI Payment</div>
                            <div className="text-gray-600 mt-1">Pay instantly with UPI</div>
                            {paymentMethod === 'UPI' && (
                              <div className="mt-4">
                                <Field
                                  name="upiId"
                                  placeholder="yourname@upi"
                                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                                />
                                {errors.upiId && touched.upiId && (
                                  <div className="text-red-500 text-sm mt-2">{errors.upiId}</div>
                                )}
                                <div className="flex gap-3 mt-3">
                                  <SiGooglepay className="text-3xl text-gray-400" />
                                  <SiPhonepe className="text-3xl text-blue-600" />
                                  <SiPaytm className="text-3xl text-blue-500" />
                                </div>
                              </div>
                            )}
                          </div>
                        </label>

                        {/* Credit Card Option */}
                        <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'CreditCard' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'CreditCard'}
                            onChange={(e) => {
                              setPaymentMethod('CreditCard');
                              setFieldValue('paymentMethod', 'CreditCard');
                            }}
                            className="w-5 h-5 text-secondary mr-4"
                          />
                          <FaCreditCard className="text-2xl text-gray-600 mr-4" />
                          <div className="flex-1">
                            <div className="font-bold text-lg">Credit/Debit Card</div>
                            <div className="text-gray-600 mt-1">Pay with your card</div>
                            {paymentMethod === 'CreditCard' && (
                              <div className="mt-4 space-y-4">
                                <div>
                                  <Field
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                                  />
                                  {errors.cardNumber && touched.cardNumber && (
                                    <div className="text-red-500 text-sm mt-2">{errors.cardNumber}</div>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Field
                                      name="expiry"
                                      placeholder="MM/YY"
                                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                                    />
                                    {errors.expiry && touched.expiry && (
                                      <div className="text-red-500 text-sm mt-2">{errors.expiry}</div>
                                    )}
                                  </div>
                                  <div>
                                    <Field
                                      name="cvv"
                                      placeholder="CVV"
                                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                                    />
                                    {errors.cvv && touched.cvv && (
                                      <div className="text-red-500 text-sm mt-2">{errors.cvv}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-3 mt-2">
                                  <SiVisa className="text-4xl text-blue-900" />
                                  <SiMastercard className="text-4xl text-red-600" />
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || paymentLoading}
                      className={`w-full py-5 rounded-xl font-bold text-xl text-background mt-8 ${
                        isSubmitting || paymentLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-secondary'
                      } transition-all`}
                    >
                      {isSubmitting || paymentLoading ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Processing Payment...
                        </span>
                      ) : (
                        `Pay ₹${total}`
                      )}
                    </button>

                    {paymentError && (
                      <div className="text-red-500 text-center p-3 bg-red-50 rounded-xl">
                        {paymentError}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="mb-8 max-h-80 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.productId} className="flex items-center gap-4 p-3 mb-3 bg-gray-50 rounded-xl">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain bg-white p-2 rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-bold">₹{(total * 0.18).toFixed(0)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Security Guarantee */}
              <div className="mt-8 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FaLock className="text-green-600" />
                  <div>
                    <p className="font-bold text-green-800">Secure Payment</p>
                    <p className="text-sm text-green-700">Your payment is 100% secure</p>
                  </div>
                </div>
              </div>

              {/* Return Policy */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  ✅ 30-day return policy • ✅ Free shipping • ✅ 24/7 support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;