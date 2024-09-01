"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [placement, setPlacement] = useState("arm");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const truncatedPrompt = prompt.length > 100 ? prompt.slice(0, 100) + '...' : prompt;
      const fullPrompt = `Photorealistic tattoo of ${truncatedPrompt} on human ${placement}, closeup view`;
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          negative_prompt: "canvas, paper, drawing, sketch, cartoon, anime, illustration, digital art",
          styling: {
            style: style,
            framing: "closeup"
          },
          image: {
            size: "square"
          },
          num_inference_steps: 50,
          guidance_scale: 8.5
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      if (!data.data || !data.data[0] || !data.data[0].base64) {
        throw new Error('Invalid response format from API');
      }
      setGeneratedImage(`data:image/png;base64,${data.data[0].base64}`);
    } catch (error) {
      console.error('Failed to generate image:', error);
      setError(`Failed to generate image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tattoo Design Generator</h1>
      
      <div className="w-full max-w-md">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Describe your tattoo (e.g., 'a rose with a butterfly')"
          maxLength={100}
        />
        
        <p className="text-sm text-gray-500 mb-2">For best results, keep descriptions short and simple (max 100 characters).</p>
        
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="photorealistic">Photorealistic</option>
          <option value="black and gray">Black and Gray</option>
          <option value="old school">Old School</option>
          <option value="neo-traditional">Neo-Traditional</option>
          <option value="tribal">Tribal</option>
        </select>
        
        <select
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="inner forearm">Inner Forearm</option>
          <option value="outer bicep">Outer Bicep</option>
          <option value="upper back">Upper Back</option>
          <option value="chest">Chest</option>
          <option value="calf">Calf</option>
          <option value="thigh">Thigh</option>
        </select>
        
        <button
          onClick={generateImage}
          disabled={isLoading || !prompt}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Generating...' : 'Generate Tattoo Design'}
        </button>
        
        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}
        
        {generatedImage && (
          <div className="mt-4">
            <Image src={generatedImage} alt="Generated tattoo design" width={400} height={400} />
          </div>
        )}
      </div>
    </main>
  );
}
