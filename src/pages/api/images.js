import axios from 'axios'
import { uploadImageToS3, listS3Objects, getSignedImageUrl } from './aws-s3.lib'
import https from 'https';
import * as animals from 'random-animals-api'

const httpsAgent = new https.Agent({ family: 4 });
 
const ANIMAL_TYPE = process.env.ANIMAL_TYPE || 'dogs'
const POD_NAMESPACE = process.env.POD_NAMESPACE
 
const getUrl = (animalType) => {
  switch(animalType.toLowerCase()) {
    case 'dog':
    case 'dogs':
      return animals.dog()
    case 'cat':
    case 'cats':
      return `https://cataas.com/cat`
    case 'bunny':
    case 'bunnies':
    case 'rabbit':
    case 'rabbits':
      return animals.bunny()
    case 'bird':
    case 'birds':
    case 'duck':
    case 'ducks':
      return animals.duck()
    case 'fox':
    case 'foxes':
      return animals.fox()
    case 'lizard':
    case 'lizards':
      return animals.lizard()
    default:
      return null
  }
}
 
export const getImagesFromS3 = async () => {
  const output = await listS3Objects(`${POD_NAMESPACE}`)
  const contents = output.Contents ? [...output.Contents].reverse() : []
  const promise = contents.map(o => getSignedImageUrl(o.Key))
  return Promise.all(promise)
}
 
export const putImageToS3 = async () => {
  const url = await getUrl(ANIMAL_TYPE)
  console.log("🚀 ~ putImageToS3 ~ url:", url)
  if (!url) {
    throw new Error('Invalid animal type: ' + ANIMAL_TYPE)
  }
  try {
    const res = await axios.get(url, { 
      responseType: 'arraybuffer',
      httpsAgent,
      timeout: 20_000,
      headers: {
        'Accept': 'image/*'
      }
    })
    
    // Get the content type from response headers or default to 'jpg'
    const contentType = res.headers['content-type'] || 'image/jpeg'
    const extension = contentType.split('/')[1] || 'jpg'
    
    const key = `${POD_NAMESPACE}/${new Date().toISOString()}-${ANIMAL_TYPE}.${extension}`
    console.log("🚀 ~ putImageToS3 ~ key:", key)
    
    if (!res.data || res.data.length === 0) {
      throw new Error('Empty image data received')
    }
    
    return uploadImageToS3(res.data, key)
  } catch (err) {
    console.error("🚀 ~ putImageToS3 ~ err:", err)
    throw err
  }
}
 
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const images = await getImagesFromS3()
    res.status(200).json({ animalType: ANIMAL_TYPE, images: images })
  } else if (req.method === 'POST') {
    await putImageToS3()
    res.status(200).json({ ok: true })
  }
}
