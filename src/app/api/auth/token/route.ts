import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiSecret } = body;

    const envSecret = process.env.API_SECRET;

    if (!envSecret) {
      console.warn('API_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (apiSecret !== envSecret) {
      return NextResponse.json({ error: 'Invalid API Secret' }, { status: 401 });
    }

    const token = uuidv4();

    return NextResponse.json({ accessToken: token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
