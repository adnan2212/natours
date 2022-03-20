/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

const Stripe = require('stripe');
const stripe = Stripe(
  'pk_test_51KeXf3SDLWpruLZ7GbdZKLI9g9ewQ2V57djJfpAdArQJ47C6FkYrtNRNCDN84Gsivbmrul4zFOcgZexqWp5GvX8j00ajVAbFku'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    //   2) Craete checkout form + charge credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
