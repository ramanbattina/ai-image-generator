import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { prompt, negative_prompt, image } = await request.json();
    console.log('Received prompt:', prompt);

    const response = await axios.post(
      'https://api.freepik.com/v1/ai/text-to-image',
      {
        prompt,
        negative_prompt,
        image,
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': process.env.FREEPIK_API_KEY,
        },
      }
    );

    console.log('API response status:', response.status);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error.response ? error.response.data : error.message },
      { status: error.response ? error.response.status : 500 }
    );
  }
}