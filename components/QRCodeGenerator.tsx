"use client";

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  text: string;
  size?: number;
  onQRCodeGenerated: (dataUrl: string) => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  text, 
  size = 128, 
  onQRCodeGenerated 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, { width: size }, (error) => {
        if (error) {
          console.error(error);
          return;
        }
        const dataUrl = canvasRef.current?.toDataURL('image/png');
        if (dataUrl) {
          onQRCodeGenerated(dataUrl);
        }
      });
    }
  }, [text, size, onQRCodeGenerated]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="border border-gray-200"
    />
  );
};