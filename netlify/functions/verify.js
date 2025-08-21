export async function handler(event) {
  const GUILD_ID = "1404264776871182446"; // staff server

  const authHeader = event.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: false, error: "Missing or invalid Authorization header" })
    };
  }

  const accessToken = authHeader.slice("Bearer ".length).trim();

  const roleId = event.queryStringParameters.roleId;
  if (!roleId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: false, error: "Missing roleId" })
    };
  }

  try {
    const memberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!memberResponse.ok) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: false })
      };
    }

    const member = await memberResponse.json();
    const hasRole = Array.isArray(member.roles) && member.roles.includes(roleId);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: hasRole })
    };
  } catch (err) {
    console.error("Verification error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: false, error: "Internal server error" })
    };
  }
}
