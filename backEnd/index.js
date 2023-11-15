const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.post('/api/download', async (req, res) => {
    try {
        const { videoUrl, format } = req.body;
        const videoInfo = await ytdl.getInfo(videoUrl);

        // Check if the requested format is mp3
        if (format && format.toLowerCase() === 'mp3') {
            // Directly download the audio without video
            const audioReadableStream = ytdl.downloadFromInfo(videoInfo, { filter: 'audioonly', quality: 'highestaudio' });
            const outputFilePath = 'audio.mp3';
            const audioWriteableStream = fs.createWriteStream(outputFilePath);

            audioReadableStream.pipe(audioWriteableStream);

            audioWriteableStream.on('finish', () => {
                console.log(`Audio (MP3) downloaded successfully to ${outputFilePath}`);
                res.sendFile(path.resolve(outputFilePath));
            });
        } else {
            // Choose the desired video format and quality
            const selectedFormat = format || 'highestvideo';
            const selectedQuality = ytdl.chooseFormat(videoInfo.formats, { quality: selectedFormat });

            if (!selectedQuality) {
                return res.status(400).json({ error: 'Selected format not available for the provided video URL' });
            }

            const outputFilePath = `video.${selectedQuality.container}`;
            const videoReadableStream = ytdl(videoUrl, { format: selectedQuality });
            const videoWriteableStream = fs.createWriteStream(outputFilePath);

            videoReadableStream.pipe(videoWriteableStream);

            videoWriteableStream.on('finish', () => {
                console.log(`Video downloaded successfully to ${outputFilePath}`);
                res.sendFile(path.resolve(outputFilePath));
            });
        }
    } catch (error) {
        console.error(`Error downloading video/audio: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => console.log(`server is run on port ${port}`));
