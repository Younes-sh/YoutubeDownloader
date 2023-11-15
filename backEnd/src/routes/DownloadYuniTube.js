// const fs = require('fs');
// const ytdl = require('ytdl-core');

// const videoUrl = 'https://www.youtube.com/watch?v=VgJ-QToLPUA';
// const outputFilePath = 'video.mp4';

// const downloadVideo = async () => {
//   try {
//     const videoInfo = await ytdl.getInfo(videoUrl);
//     const videoReadableStream = ytdl(videoUrl, { quality: 'highestvideo' });
//     const videoWriteableStream = fs.createWriteStream(outputFilePath);

//     videoReadableStream.pipe(videoWriteableStream);

//     videoWriteableStream.on('finish', () => {
//       console.log(`Video downloaded successfully to ${outputFilePath}`);
//     });
//   } catch (error) {
//     console.error(`Error downloading video: ${error.message}`);
//   }
// };

// downloadVideo();
