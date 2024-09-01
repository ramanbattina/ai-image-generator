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
      const fullPrompt = `Tattoo design of ${prompt} in ${style} style for ${placement} placement`;
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      const data = await response.json();
      setGeneratedImage(`data:image/png;base64,${data.data[0].base64}`);
    } catch (error) {
      console.error('Failed to generate image:', error);
      setError('Failed to generate image. Please try again.');
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
        />
        
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="realistic">Realistic</option>
          <option value="minimalist">Minimalist</option>
          <option value="traditional">Traditional</option>
          <option value="watercolor">Watercolor</option>
          <option value="geometric">Geometric</option>
        </select>
        
        <select
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="arm">Arm</option>
          <option value="leg">Leg</option>
          <option value="back">Back</option>
          <option value="chest">Chest</option>
          <option value="wrist">Wrist</option>
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
