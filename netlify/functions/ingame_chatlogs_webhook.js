// FILE USES SCP: ROLEPLAY IN-GAME ADDON. SUBJECT TO CHANGE.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  const { username, message, timestamp } = data;

  const { error } = await supabase
    .from('chat_logs')
    .insert([{ username, message, timestamp }]);

  if (error) {
    console.error(error);
    return { statusCode: 500, body: 'Insert failed' };
  }

  return { statusCode: 200, body: 'Chat saved' };
}
