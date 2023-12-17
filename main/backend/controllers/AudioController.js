const joi = require('joi');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const tmp = require('tmp');
const nodeId3 = require('node-id3');
const { AudioFormatEnum } = require('../constants');

const uploadSchema = joi.object({
  title: joi.string().optional().allow(''),
  year: joi.date().optional().allow(''),
  artist: joi.string().optional().allow(''),
  album: joi.string().optional().allow(''),
});

const downloadSingleSchema = joi.object({
  format: joi
    .string()
    .valid(...Object.values(AudioFormatEnum))
    .optional(),
});

exports.downloadMix = (req, res) => {
  try {
    const audioFiles = req.files;

    if (!audioFiles || audioFiles.length === 0) {
      return res
        .status(400)
        .json({ error: 'Please provide at least one audio file.' });
    }

    // Create an array to store temporary file paths
    const tempFiles = [];

    // Write each audio file to a temporary file
    audioFiles.forEach((audio, index) => {
      const tempFile = tmp.tmpNameSync({ postfix: '.mp3' });
      fs.writeFileSync(tempFile, audio.buffer);
      tempFiles.push(tempFile);
    });

    // Define the output file path
    const outputPath = './output.mp3';

    // Perform audio mixing using ffmpeg
    const command = ffmpeg();

    tempFiles.forEach(tempFile => command.input(tempFile));

    const filterString = tempFiles.map((_, index) => `[${index}:0]`).join('');

    command
      .audioCodec('libmp3lame')
      .complexFilter([
        `${filterString}amix=inputs=${tempFiles.length}:duration=longest[a]`,
      ])
      .map('[a]')
      .on('end', () => {
        tempFiles.forEach(tempFile => fs.unlinkSync(tempFile));
        return res.status(201).download(outputPath);
      })
      .on('error', err => {
        tempFiles.forEach(tempFile => fs.unlinkSync(tempFile));
        return res.status(500).json({ error: 'Internal server error.' });
      })
      .save(outputPath);
  } catch (error) {
    res.status(500).json({ success: false, message: error?.message || error });
  }
};

exports.editMetaTags = async (req, res) => {
  try {
    const { error, value } = uploadSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const id3Tags = nodeId3.read(req.file.buffer);
    const newTags = {
      ...id3Tags,
      ...value,
    };

    // Write updated ID3 tags back to the file
    const updatedAudioFile = nodeId3.write(newTags, req.file.buffer);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=updatedAudioFile.mp3'
    );
    res.setHeader('Content-Type', req.file.mimetype);
    return res.status(201).send(updatedAudioFile);
  } catch (error) {
    res.status(500).json({ success: false, message: error?.message || error });
  }
};

exports.downloadSingle = async (req, res) => {
  try {
    const { error, value } = downloadSingleSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { format: outputFormat } = value;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'Please upload audio file.' });
    }

    const [originalName, originalExtension] = audioFile.originalname.split('.');
    const outputExtension = outputFormat || originalExtension;
    const outputMIMEType = outputFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';
    const outputFileName = [originalName, outputExtension].join('.');

    const inputFilePath = audioFile.path;
    const outputFilePath = ['./backend/converted', outputFileName].join('/');

    const command = ffmpeg();
    command.audioCodec('pcm_s16le');
    command.input(inputFilePath);

    if (outputFormat !== originalExtension) {
      command.format(outputFormat);
    }

    command
      .on('end', () => {
        res.setHeader('Content-Type', outputMIMEType);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${outputFileName}`
        );

        const stream = fs.createReadStream(
          `./backend/converted/${outputFileName}`
        );
        stream.pipe(res);

        stream.on('end', () => {
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        });
      })
      .on('error', err => {
        console.log(err);
      })
      .save(`./backend/converted/${outputFileName}`);
  } catch (error) {
    res.status(500).json({ success: false, message: error?.message || error });
  }
};
