import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404).send('')
  }

  const payload = req.query as { passing: string }

  const data = payload.passing === 'true' ? 'passing' : 'not-passing'
  fs.writeFile('state.txt', data, (err) => {
    if (err) {
      return res.status(500)
    }

    res.status(200).send('ok')
  })
}

export default handler
