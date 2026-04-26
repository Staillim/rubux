exports.handler = async function handler(event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const username = String(event.queryStringParameters?.username || '').trim();
  if (!username) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'El parametro username es requerido.' })
    };
  }

  try {
    const usersResponse = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });

    if (!usersResponse.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'No se pudo consultar usuarios en Roblox.' })
      };
    }

    const usersPayload = await usersResponse.json();
    const robloxUser = usersPayload?.data?.[0];

    if (!robloxUser?.id) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Usuario no encontrado.' })
      };
    }

    let avatarUrl = '';
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUser.id}&size=420x420&format=Png&isCircular=false`
    );

    if (avatarResponse.ok) {
      const avatarPayload = await avatarResponse.json();
      avatarUrl = avatarPayload?.data?.[0]?.imageUrl || '';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        userId: robloxUser.id,
        username: robloxUser.name,
        avatarUrl
      })
    };
  } catch (_error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno consultando Roblox.' })
    };
  }
};
