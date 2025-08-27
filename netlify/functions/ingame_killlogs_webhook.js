// FILE USES SCP: ROLEPLAY IN-GAME ADDON. SUBJECT TO CHANGE.
exports.handler = async function(event, context) {
  const discordWebhook = process.env.DISCORD_WEBHOOK_INGAMEKILLLOGS;
  if (!discordWebhook) {
    return {
      statusCode: 500,
      body: "Discord webhook URL not configured."
    };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch(discordWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: body.content })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Discord webhook error: ${response.statusText}`
      };
    }

    return {
      statusCode: 200,
      body: "Message sent to Discord successfully."
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: `Error: ${error.message}`
    };
  }
};
