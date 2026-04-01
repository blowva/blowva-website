export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://blowva.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'No description' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `You are a viral social media expert for Nigerian creators. Generate an engaging caption and hashtags for this video: "${description}". Return ONLY this JSON: {"caption": "2-3 line engaging caption with emojis for Nigerian audience", "hashtags": "10-15 relevant hashtags including #NaijaCreator #Nigeria #Blowva"}`
      }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text.trim();
  const match = text.match(/\{[\s\S]*\}/);
  const result = JSON.parse(match[0]);

  res.status(200).json(result);
}
