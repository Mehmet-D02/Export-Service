const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/pdf', createProxyMiddleware({ target: 'http://json-to-pdf:3001', changeOrigin: true }));
app.use('/csv', createProxyMiddleware({ target: 'http://json-to-csv:3002', changeOrigin: true }));

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});
