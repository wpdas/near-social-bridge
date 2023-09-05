import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

// NOTE: this is fragile. Use some tool to verify and test the HTML elements
// TODO: use origin
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404).send('')
  }

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: ['*', 'null'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  const payload = req.query as { passing: string }

  if (!payload?.passing) {
    return res.status(200).send('not set')
  }

  const data = payload.passing === 'true' ? 'passing' : 'not-passing'
  fs.writeFile('state.txt', data, (err) => {
    if (err) {
      return res.status(500)
    }

    res.status(200).send('ok')
  })
}

export default handler
