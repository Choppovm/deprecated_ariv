export async function handler(event) {
  const CONFIGS = {
    eventcommittee: {
      guildId: "1404264776871182446", // staff server
      roleId: "1404268041759494204" // event committee
    },
    gamemoderationteam: {
      guildId: "1404264776871182446", // staff server
      roleId: "1404268039540576358" // game moderation team
    },
    serverstartuphosts: {
      guildId: "1404264776871182446", // staff server
      roleId: "1404266962007097354" // server start up hosts
    },
    actingdepartment: {
      guildId: "1404264776871182446", // staff server
      roleId: "1404267939431186532" // acting department
    },
    morphingdepartment: {
      guildId: "1404264776871182446", // staff server
      roleId: "1404268189009055866" // morphing department
    }
  };

  const authHeader = event.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: false, error: "Missing or invalid Authorization header" })
    };
  }

  const accessToken = authHeader.slice("Bearer ".length).trim();
  const pageKey = event.queryStringParameters.pageKey;
  if (!pageKey || !CONFIGS[pageKey]) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: false, error: "Invalid pageKey" })
    };
  }

  const { guildId, roleId } = CONFIGS[pageKey];

  try {
    const memberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${guildId}/member`,
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
