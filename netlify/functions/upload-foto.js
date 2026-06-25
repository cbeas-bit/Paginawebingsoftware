exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SUPABASE_URL = "https://mvtdzqjtbmgvhdoouhjw.supabase.co";
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;

  if (!SERVICE_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Variable de entorno no configurada' }) };
  }

  try {
    const { fileName, fileBase64, fileType } = JSON.parse(event.body);

    if (!fileName || !fileBase64 || !fileType) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos: fileName, fileBase64, fileType' }) };
    }

    const buffer = Buffer.from(fileBase64, 'base64');

    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/Productos/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'apikey': SERVICE_KEY,
          'Content-Type': fileType,
          'x-upsert': 'true',
        },
        body: buffer,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: 400, body: JSON.stringify({ error: err }) };
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/Productos/${fileName}`;
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ url: publicUrl }),
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
