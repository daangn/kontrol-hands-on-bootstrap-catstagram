import { putImageToS3 } from '../src/pages/api/images'

const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET
const POD_NAMESPACE = process.env.POD_NAMESPACE
const ANIMAL_TYPE = process.env.ANIMAL_TYPE

if (!AWS_S3_BUCKET) throw new Error('AWS_S3_BUCKET is not defined')
if (!POD_NAMESPACE) throw new Error('POD_NAMESPACE is not defined')
if (!ANIMAL_TYPE) throw new Error('ANIMAL_TYPE is not defined')

;(async () => {
  console.log(`putting image with ANIMAL_TYPE: ${ANIMAL_TYPE}`)
  await putImageToS3()
  console.log('done!')
})()

// yarn esbuild bin/put-animal.js --target=node20 --outdir=build/ --bundle --packages=external --loader:=js
