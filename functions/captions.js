const express = require('express');
const { spawn } = require('child_process');
const app = express();

// Set up a route to download captions
app.get('/:videoId/:lang', (req, res) => {
  const { videoId, lang } = req.params;
  const ytDlp = spawn('yt-dlp', ['-f', 'best', '--sub-lang', lang, '--write-sub', '--sub-format', 'srt', `https://www.youtube.com/watch?v=${videoId}`]);

  let captions = '';

  ytDlp.stdout.on('data', (data) => {
    captions += data;
  });

  ytDlp.stderr.on('data', (data) => {
    console.error(`yt-dlp error: ${data}`);
  });

  ytDlp.on('close', (code) => {
    if (code === 0) {
      res.set('Content-Type', 'text/plain');
      res.send(captions);
    } else {
      res.status(500).send(`Failed to download captions (exit code ${code})`);
    }
  });
});

// Export the Express app as a Netlify function
module.exports.handler = app;