import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Sending request to Freepik API:', body);

    const response = await axios.post(
      'https://api.freepik.com/v1/ai/text-to-image',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': process.env.FREEPIK_API_KEY,
        },
      }
    );

    console.log('Received response from Freepik API:', response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error.response ? error.response.data : error.message },
      { status: error.response ? error.response.status : 500 }
    );
  }
}