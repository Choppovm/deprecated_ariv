// contact me on discord (@choppovm) if i leaked any secret keys/webhooks (silly me!)
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { team, payload } = JSON.parse(event.body);

    // Map team names to environment variables
    const webhookMap = {
      O5COUNCIL: process.env.DISCORD_WEBHOOK_O5COUNCIL,
      FACTIONSHUBSTAFF: process.env.DISCORD_WEBHOOK_FACTIONSHUBSTAFF,
      SERVERSTARTUPDEPARTMENT: process.env.DISCORD_WEBHOOK_SERVERSTARTUPDEPARTMENT,
      DEVELOPMENTTEAM: process.env.DISCORD_WEBHOOK_DEVELOPMENTTEAM,
      DISCORDMODERATIONTEAM: process.env.DISCORD_WEBHOOK_DISCORDMODERATIONTEAM,
      GAMEMODERATIONTEAM: process.env.DISCORD_WEBHOOK_GAMEMODERATIONTEAM,
      LOREDEPARTMENT: process.env.DISCORD_WEBHOOK_LOREDEPARTMENT,
      ACTINGDEPARTMENT: process.env.DISCORD_WEBHOOK_ACTINGDEPARTMENT,
      EVENTCOMMITTEE: process.env.DISCORD_WEBHOOK_EVENTCOMMITTEE,
      MORPHINGDEPARTMENT: process.env.DISCORD_WEBHOOK_MORPHINGDEPARTMENT,
      APPEALSANDREPORTSTEAM: process.env.DISCORD_WEBHOOK_APPEALSANDREPORTSTEAM
    };

    const webhookUrl = webhookMap[team];
    if (!webhookUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid team" })
      };
    }

    // Send to Discord
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return {
      statusCode: response.status,
      body: await response.text()
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
