import axios from 'axios';

export default async function handler(req, res) {
  const { format } = req.query;
  const data = req.body;
  //Gelen yonlendirmeli alir adreslere gonderir 
  let targetUrl = '';
  if (format === 'pdf') {
    targetUrl = 'http://json-to-pdf:3001/convert';
  } else if (format === 'csv') {
    targetUrl = 'http://json-to-csv:3002/convert';
  }

  try {
    const response = await axios.post(targetUrl, data, {
      responseType: 'arraybuffer',
      maxBodyLength: Infinity,  // İstek boyutunu sınırsız yapar
      maxContentLength: Infinity // İstek içeriği boyutunu sınırsız yapar
    });
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Conversion error' });
  }
}
