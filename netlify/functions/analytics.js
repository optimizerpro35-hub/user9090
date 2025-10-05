exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { action, config } = JSON.parse(event.body);
    
    const analyticsData = {
      timestamp: new Date().toISOString(),
      action: action,
      config: config,
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
      userAgent: event.headers['user-agent']
    };

    console.log('�� Analytics Optimizer VTX:', analyticsData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        recorded: true,
        message: 'Analytics registrado'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
