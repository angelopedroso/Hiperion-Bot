import fs from 'fs-extra'
import axios from 'axios'
import FormData from 'form-data'

export const checkIfContentIsExplict = async (
  filePath: string,
): Promise<boolean> => {
  const form = new FormData()

  form.append('media', fs.createReadStream(filePath))
  form.append('models', 'nudity-2.0,offensive')
  form.append('api_user', process.env.API_SIGHTENGINE_USER + '')
  form.append('api_secret', process.env.API_SIGHTENGINE_SECRET + '')

  const { data } = await axios({
    method: 'post',
    url: 'https://api.sightengine.com/1.0/check.json',
    data: form,
    headers: form.getHeaders(),
  })

  await fs.unlink(filePath)

  const probality = data.nudity.none < 0.15 || data.offensive.prob > 0.65

  return probality
}
