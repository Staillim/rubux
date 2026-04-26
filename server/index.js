import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'roblox-giveaway-api' });
});

app.get('/api/roblox/user', async (req, res) => {
  const username = String(req.query.username || '').trim();
  if (!username) {
    return res.status(400).json({ error: 'El parametro username es requerido.' });
  }

  try {
    const usersResponse = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    if (!usersResponse.ok) {
      return res.status(502).json({ error: 'No se pudo consultar usuarios en Roblox.' });
    }

    const usersPayload = await usersResponse.json();
    const robloxUser = usersPayload?.data?.[0];

    if (!robloxUser?.id) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUser.id}&size=420x420&format=Png&isCircular=false`
    );

    let avatarUrl = '';
    if (avatarResponse.ok) {
      const avatarPayload = await avatarResponse.json();
      avatarUrl = avatarPayload?.data?.[0]?.imageUrl || '';
    }

    return res.json({
      userId: robloxUser.id,
      username: robloxUser.name,
      avatarUrl
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno consultando Roblox.' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`);
});
