export async function handler(event) {
  const CLIENT_ID = process.env.DISCORD_APPLICATION_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_APPLICATION_CLIENT_SECRET;
  const REDIRECT_URI = "https://ariv-staff-activity-logger.netlify.app/.netlify/functions/callback";
  const GUILD_ID = "1403892617766375507";
  const ROLE_ID = "1403893385588113500";
  const WEBHOOK_URL = process.env.DISCORD_GLOBAL_WEBHOOK_LOG;

  const code = event.queryStringParameters.code;
  if (!code) {
    return { statusCode: 400, body: "No code provided" };
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        scope: "identify guilds guilds.members.read",
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return { statusCode: 400, body: "Failed to get access token" };
    }

    // 2. Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userResponse.json();

    // 3. Get member info in the target guild
    const memberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (memberResponse.status !== 200) {
      await sendEmbed(user, false, WEBHOOK_URL);
      return { statusCode: 200, body: "User not in guild" };
    }

    const member = await memberResponse.json();
    const hasRole = member.roles.includes(ROLE_ID);

    // 4. Send webhook result
    await sendEmbed(user, hasRole, WEBHOOK_URL);

    return {
      statusCode: 200,
      body: hasRole
        ? "User has the required role"
        : "User is in guild but missing role"
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error occurred" };
  }
}

async function sendEmbed(user, success, webhookUrl) {
  const embed = {
    title: success ? "Success" : "Failure",
    description: success
      ? `${user.username}#${user.discriminator} has the required role.`
      : `${user.username}#${user.discriminator} does not have the role.`,
    color: success ? 0x00ff00 : 0xff0000,
    thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` },
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}
