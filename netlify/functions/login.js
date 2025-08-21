export async function handler(event) {
  const CLIENT_ID = process.env.DISCORD_APPLICATION_CLIENT_ID;
  const REDIRECT_URI = "https://ariv-staff-activity-logger.netlify.app/.netlify/functions/callback";
  const scopes = ["identify", "guilds", "guilds.members.read"];

  const pageKey = event.queryStringParameters.pageKey;
  if (!pageKey) {
    return { statusCode: 400, body: "Missing pageKey" };
  }

  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${scopes.join("%20")}&state=${encodeURIComponent(pageKey)}`;

  return {
    statusCode: 302,
    headers: { Location: url }
  };
}
