export async function handler(event) {
  const GUILD_ID = "1404264776871182446";

  const authHeader = event.headers.authorization;
  if (!authHeader) {
    return { statusCode: 401, body: JSON.stringify({ verified: false }) };
  }

  const accessToken = authHeader.replace("Bearer ", "");

  // Get roleId from query string (changes per staff dept)
  const roleId = event.queryStringParameters.roleId;
  if (!roleId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing roleId" }) };
  }

  // Check guild membership
  const memberResponse = await fetch(
    `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (memberResponse.status !== 200) {
    return { statusCode: 200, body: JSON.stringify({ verified: false }) };
  }

  const member = await memberResponse.json();
  const hasRole = member.roles.includes(roleId);

  return {
    statusCode: 200,
    body: JSON.stringify({ verified: hasRole })
  };
}
