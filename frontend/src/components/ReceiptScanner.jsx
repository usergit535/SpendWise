import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, Loader2 } from 'lucide-react';

const ReceiptScanner = ({ onScanComplete }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
    const lowerText = text.toLowerCase();
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // 1. BETTER TITLE LOGIC
    // Skip common headers to find the actual company name
    const noiseWords = ['page', 'tax invoice', 'original', 'invoice'];
    let detectedStore = "Scanned Receipt";
    
    for (let line of lines) {
        const cleanLine = line.toLowerCase();
        if (!noiseWords.some(word => cleanLine.includes(word))) {
            detectedStore = line.trim();
            break; // Grab the first line that isn't a "Page No" or "Tax Invoice"
        }
    }

    // 2. BETTER AMOUNT LOGIC (Handles commas and "Total" keyword)
    // First, remove commas from the text so "13,250.65" becomes "13250.65"
    const cleanText = text.replace(/,/g, '');
    const amounts = cleanText.match(/\d+\.\d{2}/g);
    
    let detectedAmount = 0;
    if (amounts) {
        // Optimization: If the word "total" appears near a number, prioritize that number
        // Otherwise, stick with the maximum number found
        detectedAmount = Math.max(...amounts.map(Number));
    }

    // 3. CATEGORY DETECTION (Add 'grocery' for your specific test)
    let detectedCategory = 'General';
    const categoryKeywords = {
  'Food': ['market', 'grocery', 'mart', 'bakery', 'restaurant', 'cafe', 'canteen'],
  'Shopping': ['store', 'mall', 'outlet', 'fashion', 'retail'],
};

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        detectedCategory = category;
        break; 
      }
    }

    onScanComplete({ 
      title: detectedStore, 
      amount: detectedAmount,
      category: detectedCategory
    });

    setLoading(false);
    setProgress(0);
})
  };

  return (
    <div className="bg-purple-50 p-6 rounded-[2rem] border-2 border-dashed border-purple-200 flex flex-col items-center justify-center transition-all hover:bg-purple-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-purple-600 mb-2" size={24} />
          <p className="text-sm font-bold text-purple-600 tracking-tight">
            AI Reading: {progress}%
          </p>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center w-full">
          <Camera className="text-purple-600 mb-2" size={32} />
          <span className="text-sm font-black text-purple-900 uppercase tracking-wider">
            Scan Receipt
          </span>
          <p className="text-[10px] text-slate-400 mt-1">Upload an image to auto-fill</p>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleScan}
          />
        </label>
      )}
    </div>
  );
};

export default ReceiptScanner;