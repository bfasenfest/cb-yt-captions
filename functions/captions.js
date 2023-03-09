const { exec } = require('child_process');

exports.handler = function(event, context, callback) {
  const videoId = event.queryStringParameters.videoId;
  const command = `yt-dlp --write-auto-sub --skip-download https://www.youtube.com/watch?v=${videoId}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message
        })
      });
    }

    if (stderr) {
      console.error(`Error: ${stderr}`);
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: stderr
        })
      });
    }

    console.log(`stdout: ${stdout}`);

    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="captions.vtt"'
      },
      body: stdout
    });
  });
};