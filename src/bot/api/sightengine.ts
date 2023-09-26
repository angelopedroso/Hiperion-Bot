import fs from 'fs-extra'
import axios from 'axios'
import FormData from 'form-data'
import { API_SIGHTENGINE_SECRET, API_SIGHTENGINE_USER } from '@utils/envs'
import { printError } from '@cli/terminal'

export const checkIfContentIsExplict = async (filePath: string) => {
  try {
    const form = new FormData()

    form.append('media', fs.createReadStream(filePath))
    form.append('models', 'nudity-2.0,offensive')
    form.append('api_user', API_SIGHTENGINE_USER)
    form.append('api_secret', API_SIGHTENGINE_SECRET)

    const { data } = await axios({
      method: 'post',
      url: 'https://api.sightengine.com/1.0/check.json',
      data: form,
      headers: form.getHeaders(),
    })

    await fs.unlink(filePath)

    const probality = data.nudity.none < 0.15 || data.offensive.prob >= 0.6

    return probality
  } catch (error: Error | any) {
    printError('checkIfContentIsExplict: ' + error.message)
  }
}
