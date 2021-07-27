import { baseURL } from "../../utils/helper";
const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET;
console.log(secret);
const stripe = require("stripe")(secret);

export default async (req, res) => {
  if (req.method === "POST") {
    const { quantity, account, price, eventID } = req.body;

    //   console.log(quantity, price);
    const calculateApplicationFeeAmount = (basePrice, quantity) => {
      // console.log(10 * basePrice * quantity);
      return 10 * basePrice * quantity;
    };

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            name: "Guitar lesson",
            quantity: quantity,
            currency: "USD",
            amount: price * 100, // Keep the amount on the server to prevent customers from manipulating on client
          },
        ],
        payment_intent_data: {
          application_fee_amount: calculateApplicationFeeAmount(
            price,
            quantity
          ),
        },
        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        mode: "payment",
        // success_url: `${baseURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        success_url: `${baseURL}/rsvp/success?id=${eventID}`,
        cancel_url: `${baseURL}/rsvp/reserve?id=${eventID}`,
      },
      {
        stripeAccount: account,
      }
    );
    return res.status(200).send({
      session: session,
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
