import { STORE_IMG } from './envs'
import axios from 'axios'
import fs from 'fs-extra'
import FormData from 'form-data'
import { printError } from '@cli/terminal'

export async function uploadImage(image: string) {
  try {
    const form = new FormData()

    form.append('image', fs.createReadStream(image))

    const { data } = await axios({
      method: 'post',
      url: 'https://api.imgur.com/3/image/',
      data: form,
      headers: {
        Authorization: `Client-ID ${STORE_IMG}`,
      },
    })

    return data.data.link
  } catch (error: Error | any) {
    printError('uploadImage: ' + error.message)
    console.log(error)
  }
}
