const { spawn } = require('child_process');
const fs = require('fs');
import { getSubtitles } from 'youtube-captions-scraper';

// const YTDlpWrap = require('yt-dlp-wrap').default;


exports.handler = function(event, context, callback) {
  const videoId = event.queryStringParameters.videoId;
  const ytDlpPath = `${__dirname}/yt-dlp`;
  const filePath = `tmp/captions-${videoId}`;
  const args = [
    '--write-auto-sub',
    '--skip-download',
    `https://www.youtube.com/watch?v=${videoId}`,
    '-o',
    filePath
  ];

  return getSubtitles({
    videoID: videoId , // youtube video id
    lang: 'en' // default: `en`
  }).then(captions => {
    let text = ''
    captions.forEach(caption => {
      text += caption.text + ' '
    })
    console.log(text)
    return {
      statusCode: 200,
      body: JSON.stringify({ transcript: text}),
      headers: {
        "access-control-allow-origin": "*",
      }
    };

  });

  // await YTDlpWrap.downloadFromGithub(
  //   'bin/yt-dlp',
  //   '2020.06.16.1',
  //   'win32'
  // );
  
  // const ytDlpWrap = new YTDlpWrap('bin/yt-dlp');

  // let ytDlpEventEmitter = ytDlpWrap
  //   .exec(args)
  //   .on('progress', (progress) =>
  //       console.log(
  //           progress.percent,
  //           progress.totalSize,
  //           progress.currentSpeed,
  //           progress.eta
  //       )
  //   )
  //   .on('ytDlpEvent', (eventType, eventData) =>
  //       console.log(eventType, eventData)
  //   )
  //   .on('error', (error) => console.error(error))
  //   .on('close', () => {
  //     console.log('all done')

  //     const file = fs.readFileSync(filePath + '.en-en-US.vtt');
  //     fs.unlinkSync(filePath + '.en-en-US.vtt');
  
  //     return callback(null, {
  //       statusCode: 200,
  //       headers: {
  //         'Content-Type': 'text/vtt',
  //         'Content-Disposition': `attachment; filename="${videoId}.vtt"`
  //       },
  //       body: file.toString('base64'),
  //       isBase64Encoded: true
  //     });
  //   })
  // }

  // const process = spawn( ytDlpPath, args, { cwd: '.' });

  // process.on('exit', (code) => {
  //   if (code !== 0) {
  //     console.error(`yt-dlp process exited with code ${code}`);
  //     return callback(null, {
  //       statusCode: 500,
  //       body: JSON.stringify({
  //         error: `yt-dlp process exited with code ${code}`
  //       })
  //     });
  //   }

  //   const file = fs.readFileSync(filePath + '.en-en-US.vtt');
  //   fs.unlinkSync(filePath + '.en-en-US.vtt');

  //   return callback(null, {
  //     statusCode: 200,
  //     headers: {
  //       'Content-Type': 'text/vtt',
  //       'Content-Disposition': `attachment; filename="${videoId}.vtt"`
  //     },
  //     body: file.toString('base64'),
  //     isBase64Encoded: true
  //   });
  // });
};
