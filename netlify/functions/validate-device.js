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
    const userAgent = event.headers['user-agent'] || '';
    
    const deviceInfo = {
      isAndroid: /android/i.test(userAgent),
      isIOS: /iphone|ipad|ipod/i.test(userAgent),
      isMobile: /mobile/i.test(userAgent),
      isTablet: /tablet|ipad/i.test(userAgent),
      browser: detectBrowser(userAgent),
      supportsAim: true
    };

    const optimizations = generateOptimizations(deviceInfo);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        device: deviceInfo,
        optimizations: optimizations,
        recommended_settings: getRecommendedSettings(deviceInfo)
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

function detectBrowser(ua) {
  if (/chrome|crios|crmo/i.test(ua)) return 'chrome';
  if (/firefox|fxios/i.test(ua)) return 'firefox';
  if (/safari/i.test(ua)) return 'safari';
  if (/edge|edg/i.test(ua)) return 'edge';
  return 'unknown';
}

function generateOptimizations(device) {
  return {
    graphics_quality: device.isTablet || device.isIOS ? 'high' : 'medium',
    frame_rate: device.isIOS ? 60 : 45,
    touch_response: device.isIOS ? 1.2 : 1.0,
    network_optimization: true,
    battery_saver: false
  };
}

function getRecommendedSettings(device) {
  if (device.isIOS) {
    return {
      resolution: '1920x1080',
      fps: 60,
      graphics: 'high',
      effects: 'medium',
      aux_percentage: 100
    };
  }
  
  return {
    resolution: '1280x720',
    fps: 45,
    graphics: 'medium',
    effects: 'low',
    aux_percentage: 90
  };
}
