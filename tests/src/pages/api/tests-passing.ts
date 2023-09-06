import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  if (req.method !== 'GET') {
    return res.status(404).send('')
  }

  fs.readFile('state.txt', (err, data) => {
    if (err) {
      // tests unavailable (server to this is broken here): 'https://img.shields.io/badge/Tests-unavailable-black?style=for-the-badge'
      return res
        .setHeader('Content-Type', 'image/svg+xml')
        .status(200)
        .send(
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="180" height="28" role="img" aria-label="TESTS: UNAVAILABLE"><title>TESTS: UNAVAILABLE</title><g shape-rendering="crispEdges"><rect width="62.25" height="28" fill="#555"/><rect x="62.25" width="117.75" height="28" fill="black"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100"><text transform="scale(.1)" x="311.25" y="175" textLength="382.5" fill="#fff">TESTS</text><text transform="scale(.1)" x="1211.25" y="175" textLength="937.5" fill="#fff" font-weight="bold">UNAVAILABLE</text></g></svg>'
        )
    }

    let testsPassing = data.toString() === 'passing'

    if (testsPassing) {
      // tests passing: 'https://img.shields.io/badge/Tests-Passing-green?style=for-the-badge'
      res
        .setHeader('Content-Type', 'image/svg+xml')
        .status(200)
        .send(
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="146" height="28" role="img" aria-label="TESTS: PASSING"><title>TESTS: PASSING</title><g shape-rendering="crispEdges"><rect width="62.25" height="28" fill="#555"/><rect x="62.25" width="83.75" height="28" fill="#97ca00"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100"><text transform="scale(.1)" x="311.25" y="175" textLength="382.5" fill="#fff">TESTS</text><text transform="scale(.1)" x="1041.25" y="175" textLength="597.5" fill="#fff" font-weight="bold">PASSING</text></g></svg>'
        )
    } else {
      // tests broken: 'https://img.shields.io/badge/Tests-Not%20Passing-red?style=for-the-badge'
      res
        .setHeader('Content-Type', 'image/svg+xml')
        .status(200)
        .send(
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="178" height="28" role="img" aria-label="TESTS: NOT PASSING"><title>TESTS: NOT PASSING</title><g shape-rendering="crispEdges"><rect width="62.25" height="28" fill="#555"/><rect x="62.25" width="115.75" height="28" fill="#e05d44"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100"><text transform="scale(.1)" x="311.25" y="175" textLength="382.5" fill="#fff">TESTS</text><text transform="scale(.1)" x="1201.25" y="175" textLength="917.5" fill="#fff" font-weight="bold">NOT PASSING</text></g></svg>'
        )
    }
  })
}

export default handler
