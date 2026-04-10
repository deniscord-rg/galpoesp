
const http = require('http');

exports.handler = async function(event) {
  const chave = 'fdb28fa3ed1828a14aee752c140dea55';
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const endpoint = event.queryStringParameters?.endpoint || 'imoveis/listar';
  const pesquisa = event.queryStringParameters?.pesquisa || '';
  const imovel = event.queryStringParameters?.imovel || '';

  let targetUrl = `http://dncconsu-rest.vistahost.com.br/${endpoint}?key=${chave}`;
  if (pesquisa) targetUrl += `&pesquisa=${pesquisa}`;
  if (imovel) targetUrl += `&imovel=${imovel}`;

  return new Promise((resolve) => {
    http.get(targetUrl, { headers: { 'Accept': 'application/json' }, timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: 200, headers, body: data }));
    }).on('error', (err) => {
      resolve({ statusCode: 500, headers, body: JSON.stringify({ erro: err.message }) });
    });
  });
};
