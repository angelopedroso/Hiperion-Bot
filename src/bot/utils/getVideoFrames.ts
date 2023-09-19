import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err)
      } else {
        const durationInSeconds = metadata.format?.duration || 0
        resolve(durationInSeconds)
      }
    })
  })
}

function calculateFrameTimes(duration: number): number[] {
  const middleTime = duration / 2
  return [0, middleTime]
}

async function extractFrames(
  videoPath: string,
  outputDir: string,
  frameTimes: number[],
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const framePaths: string[] = []

    ffmpeg(videoPath)
      .on('filenames', (filenames) => {
        for (const filename of filenames) {
          framePaths.push(path.join(outputDir, filename))
        }
      })
      .on('end', () => {
        resolve(framePaths)
      })
      .on('error', (err) => {
        reject(err)
      })
      .screenshots({
        timestamps: frameTimes,
        folder: outputDir,
        filename: 'frame-%w-%s.png',
      })
  })
}

export { extractFrames, calculateFrameTimes, getVideoDuration }
