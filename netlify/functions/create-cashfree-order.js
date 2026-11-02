/**
 * Cashfree Serverless Order Creation Function for Netlify
 * Endpoint: /.netlify/functions/create-cashfree-order (or /api/create-cashfree-order)
 */

export const handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { amount, customerName, customerEmail, customerPhone, orderNote } = data;

    if (!amount || !customerEmail || !customerPhone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required order fields (amount, customerEmail, customerPhone)' })
      };
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const isSandbox = process.env.CASHFREE_ENV === 'sandbox';

    if (!appId || !secretKey) {
      // Mock / Preview Mode when credentials are not yet set
      const mockOrderId = `pj_mock_${Date.now()}`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          preview_mode: true,
          order_id: mockOrderId,
          payment_session_id: `session_preview_${Date.now()}`,
          message: 'Cashfree credentials not found in env variables. Running in preview mode.'
        })
      };
    }

    const baseUrl = isSandbox
      ? 'https://sandbox.cashfree.com/pg/orders'
      : 'https://api.cashfree.com/pg/orders';

    const orderId = `order_pj_${Date.now()}`;
    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

    const cashfreePayload = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: `cust_${cleanPhone}`,
        customer_name: customerName || 'Valued Learner',
        customer_email: customerEmail,
        customer_phone: cleanPhone
      },
      order_meta: {
        return_url: `https://projuktisoft.shop/success?order_id={order_id}`
      },
      order_note: orderNote || 'ProjuktiSoft Digital Learning Bundle'
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(cashfreePayload)
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: result.message || 'Cashfree Order Creation Failed', details: result })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        order_id: result.order_id,
        payment_session_id: result.payment_session_id
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal Server Error' })
    };
  }
};

