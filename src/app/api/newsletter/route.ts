import { NextResponse } from 'next/server'
import MailerLite from '@mailerlite/mailerlite-nodejs'



export async function POST(req: Request) {
    const mailerLite = new MailerLite({
  api_key: process.env.MAILERLITE_API_KEY!,
})
  try {
    const { email } = await req.json()

    await mailerLite.subscribers.createOrUpdate({
      email,
      groups: [process.env.MAILERLITE_GROUP_ID!],
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}
