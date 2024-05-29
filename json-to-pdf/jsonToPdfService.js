const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const app = express();

// JSON limitini artırma
app.use(bodyParser.json({ limit: '100mb' }));

app.post('/convert', (req, res) => {
    try {
        const json = req.body;
        const doc = new PDFDocument();
        const filename = path.join(__dirname, 'output.pdf');
        const writeStream = fs.createWriteStream(filename);
        
        doc.pipe(writeStream);
        doc.text(JSON.stringify(json, null, 2));
        doc.end();

        writeStream.on('finish', () => {
            res.download(filename, 'output.pdf', (err) => {
                if (err) {
                    console.error('Error sending PDF:', err);
                    res.status(500).send('Error generating PDF');
                } else {
                    fs.unlink(filename, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting PDF:', unlinkErr);
                        }
                    });
                }
            });
        });

        writeStream.on('error', (error) => {
            console.error('Error writing PDF:', error);
            res.status(500).send('Error generating PDF');
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(3001, () => {
    console.log('JSON to PDF service running on port 3001');
});
