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

function getRandomTime(duration: number): number {
  return Math.random() * duration
}

async function extractRandomFrame(
  videoPath: string,
  outputDir: string,
): Promise<string> {
  const duration = await getVideoDuration(videoPath)
  const randomTime = getRandomTime(duration)

  return new Promise<string>((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => {
        const framePath = path.join(outputDir, 'random-frame.png')
        resolve(framePath)
      })
      .on('error', (err) => {
        reject(err)
      })
      .screenshots({
        timestamps: [randomTime],
        folder: outputDir,
        filename: 'random-frame.png',
      })
  })
}

export { extractRandomFrame, getVideoDuration }
