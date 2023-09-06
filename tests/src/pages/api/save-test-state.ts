import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@app/firebase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404).send('')
  }

  const env = process.env.NODE_ENV
  const origin =
    env === 'production'
      ? [
          'http://localhost:3001',
          'https://near.org',
          'https://alpha.near.org',
          'https://test.near.org',
          'https://test.near.social',
          'https://near.social/',
        ]
      : '*'

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  const payload = req.query as { passing: string }

  if (!payload?.passing) {
    return res.status(200).send('not set')
  }

  if (env === 'production') {
    const statusRef = doc(db, 'lib-test', 'production')
    await updateDoc(statusRef, { passing: payload.passing === 'true' })
  }

  res.status(200).send('ok')
}

export default handler
