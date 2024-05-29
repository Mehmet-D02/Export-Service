const express = require('express');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const app = express();

// JSON limitini artırma
app.use(bodyParser.json({ limit: '100mb' }));

app.post('/convert', (req, res) => {
    try {
        const json = req.body;
        const parser = new Parser();
        const csv = parser.parse(json);
        const filename = path.join(__dirname, 'output.csv');
        fs.writeFileSync(filename, csv);
        res.download(filename, 'output.csv', (err) => {
            if (err) {
                console.error('Error sending CSV:', err);
                res.status(500).send('Error generating CSV');
            } else {
                fs.unlink(filename, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting CSV:', unlinkErr);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).send('Error generating CSV');
    }
});

app.listen(3002, () => {
    console.log('JSON to CSV service running on port 3002');
});
