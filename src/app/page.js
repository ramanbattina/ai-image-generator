"use client";
import { useState } from "react";

export default function Home() {
  const [design, setDesign] = useState("");
  const [style, setStyle] = useState("realistic");
  const [placement, setPlacement] = useState("arm");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Realistic tattoo design of ${design} in ${style} style on human ${placement}, closeup view, highly detailed, skin texture, ink`;
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          negative_prompt: "cartoon, anime, illustration, digital art, canvas, paper, painting",
          image: { size: "600x900" }, // Pinterest optimized size
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      setGeneratedImage(`data:image/png;base64,${data.data[0].base64}`);
    } catch (error) {
      console.error('Failed to generate image:', error);
      setError(`Failed to generate image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'tattoo-design.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Tattoo Design Generator</h1>
      
      <div className="w-full max-w-md">
        <input
          type="text"
          value={design}
          onChange={(e) => setDesign(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Describe your tattoo design (e.g., rose with butterfly)"
        />
        
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="realistic">Realistic</option>
          <option value="traditional">Traditional</option>
          <option value="minimalist">Minimalist</option>
          <option value="tribal">Tribal</option>
          <option value="watercolor">Watercolor</option>
        </select>
        
        <select
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="arm">Arm</option>
          <option value="back">Back</option>
          <option value="chest">Chest</option>
          <option value="leg">Leg</option>
          <option value="wrist">Wrist</option>
        </select>
        
        <button
          onClick={generateImage}
          disabled={isLoading || !design}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Generating...' : 'Generate Tattoo Design'}
        </button>
        
        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}
        
        {generatedImage && (
          <div className="mt-4 flex flex-col items-center">
            <img src={generatedImage} alt="Generated tattoo design" className="max-w-full h-auto" />
            <button
              onClick={downloadImage}
              className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
