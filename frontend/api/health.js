export default function handler(request, response) {
  response.status(200).json({
    status: 'ok',
    service: 't-wallet',
    runtime: 'vercel',
  })
}
