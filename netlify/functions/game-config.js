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
    const { game, config } = JSON.parse(event.body);
    
    const percentage = parseInt(config.auxType) || 100;
    
    const gameConfigs = {
      'freefire': {
        packageName: 'com.dts.freefireth',
        sensitivity: {
          general: 80 + (percentage / 10),
          red_dot: 70 + (percentage / 12),
          scope_2x: 60 + (percentage / 15),
          scope_4x: 50 + (percentage / 18)
        },
        recoil: {
          vertical: Math.max(2, 20 - (percentage / 5)),
          horizontal: Math.max(1, 10 - (percentage / 8))
        },
        aim_assist: 0.85 + (percentage / 1000),
        headtracker: config.headtracker,
        no_recoil: config.noRecoil
      },
      'freefire_max': {
        packageName: 'com.dts.freefiremax',
        sensitivity: {
          general: 82 + (percentage / 10),
          red_dot: 72 + (percentage / 12),
          scope_2x: 62 + (percentage / 15),
          scope_4x: 52 + (percentage / 18)
        },
        recoil: {
          vertical: Math.max(1, 18 - (percentage / 5)),
          horizontal: Math.max(0, 8 - (percentage / 8))
        },
        aim_assist: 0.88 + (percentage / 1000),
        headtracker: config.headtracker,
        no_recoil: config.noRecoil,
        graphics_enhanced: true
      }
    };

    const gameConfig = gameConfigs[game] || gameConfigs['freefire'];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        game: game,
        config: gameConfig,
        optimized: true
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
