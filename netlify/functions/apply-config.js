exports.handler = async (event, context) => {
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
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const config = JSON.parse(event.body);
    
    const processedConfig = {
      noRecoil: config.noRecoil ? applyNoRecoil(config) : null,
      headtracker: config.headtracker ? applyHeadtracker(config) : null,
      auxValue: config.auxValue || 100,
      auxType: config.auxType || '100',
      aimType: config.aimType || 'atirar',
      timestamp: Date.now()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        config: processedConfig,
        message: 'Optimizer VTX aplicado com sucesso!'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};

function applyNoRecoil(config) {
  const percentage = parseInt(config.auxType) || 100;
  return {
    enabled: true,
    reduction: percentage,
    verticalControl: 0.95 + (percentage / 1000),
    horizontalControl: 0.92 + (percentage / 1000),
    active: true
  };
}

function applyHeadtracker(config) {
  const percentage = parseInt(config.auxType) || 100;
  const aimMode = config.aimType === 'atirar' ? 'on_shoot' : 'on_look';
  
  return {
    enabled: true,
    mode: aimMode,
    precision: 0.90 + (percentage / 1000),
    tracking: 0.88 + (percentage / 800),
    headPriority: true,
    active: true
  };
}
