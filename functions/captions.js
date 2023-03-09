const { spawn } = require('child_process');
const fs = require('fs');

exports.handler = function(event, context, callback) {
  const videoId = event.queryStringParameters.videoId;
  const filePath = `tmp/captions-${videoId}`;
  const args = [
    '--write-auto-sub',
    '--skip-download',
    `https://www.youtube.com/watch?v=${videoId}`,
    '-o',
    filePath
  ];

  const process = spawn('yt-dlp', args);

  process.on('exit', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}`);
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: `yt-dlp process exited with code ${code}`
        })
      });
    }

    const file = fs.readFileSync(filePath + '.en-en-US.vtt');
    fs.unlinkSync(filePath + '.en-en-US.vtt');

    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/vtt',
        'Content-Disposition': `attachment; filename="${videoId}.vtt"`
      },
      body: file.toString('base64'),
      isBase64Encoded: true
    });
  });
};
