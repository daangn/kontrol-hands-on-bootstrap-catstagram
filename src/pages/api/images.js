import axios from 'axios'
import { uploadImageToS3, listS3Objects, getSignedImageUrl } from './aws-s3.lib'
 
const ANIMAL_TYPE = process.env.ANIMAL_TYPE || 'dogs'
const POD_NAMESPACE = process.env.POD_NAMESPACE
 
const localData = {
  cats: [
    `https://loremflickr.com/640/480/cats?key=0`,
    `https://loremflickr.com/640/480/cats?key=1`,
  ],
  dogs: [
    `https://loremflickr.com/640/480/dogs?key=0`,
    `https://loremflickr.com/640/480/dogs?key=1`,
  ]
}
 
const getImagesFromS3 = async () => {
  const output = await listS3Objects(`${POD_NAMESPACE}/${ANIMAL_TYPE}/`)
  const contents = output.Contents ? [...output.Contents].reverse() : []
  const promise = contents.map(o => getSignedImageUrl(o.Key))
  return Promise.all(promise)
}
 
const putImageToS3 = async () => {
  const url = `https://loremflickr.com/640/480/${ANIMAL_TYPE}`
  const key = `${POD_NAMESPACE}/${ANIMAL_TYPE}/${new Date().toISOString()}.jpg`
  const res = await axios.get(url, { responseType: 'arraybuffer' })
  return uploadImageToS3(res.data, key)
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