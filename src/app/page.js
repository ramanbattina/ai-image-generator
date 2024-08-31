"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
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
      <h1 className="text-4xl font-bold mb-8">AI Image Generator</h1>
      
      <div className="w-full max-w-md">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter a prompt for the image"
        />
        <button
          onClick={generateImage}
          disabled={isLoading || !prompt}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
        
        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}
        
        {generatedImage && (
          <div className="mt-4">
            <Image src={generatedImage} alt="Generated image" width={400} height={400} />
          </div>
        )}
      </div>
    </main>
  );
}
