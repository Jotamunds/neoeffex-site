/**
 * Extrates points from an SVG image for the particle system.
 */

export function loadSVGPixels(url, particleCount) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = () => {
            // Draw image to offscreen canvas
            const canvas = document.createElement('canvas');
            // Keep resolution reasonable to extract pixels
            const width = 256;
            const height = 256;
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // Draw centered and scaled
            ctx.drawImage(img, 0, 0, width, height);
            
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            
            const validPixels = [];
            
            // Collect all pixels that are mostly opaque
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const alpha = data[index + 3];
                    
                    if (alpha > 128) {
                        // Normalize coords between -0.5 and 0.5
                        // (y is flipped so positive is UP in 3D)
                        const normX = (x / width) - 0.5;
                        const normY = -(y / height) + 0.5;
                        
                        validPixels.push({ x: normX, y: normY });
                    }
                }
            }
            
            if (validPixels.length === 0) {
                reject(new Error("No opaque pixels found in SVG"));
                return;
            }
            
            // Sample exactly particleCount pixels
            const sampled = new Float32Array(particleCount * 3);
            
            // Calculate aspect ratio scale to keep the N shape correct
            // Assuming the canvas is square, the image is drawn scaled, 
            // but the original N logo is slightly taller or wider.
            // (For Neoeffex, we just scale it by a fixed amount that looks good in 3D)
            const scaleX = 5.0; // scene scale
            const scaleY = 5.0; // scene scale
            
            for (let i = 0; i < particleCount; i++) {
                // Randomly pick one of the valid pixels
                const randIndex = Math.floor(Math.random() * validPixels.length);
                const p = validPixels[randIndex];
                
                // Add a tiny bit of random jitter so points aren't perfectly gridded
                const jitterX = (Math.random() - 0.5) * (1 / width) * 2;
                const jitterY = (Math.random() - 0.5) * (1 / height) * 2;
                
                sampled[i * 3 + 0] = (p.x + jitterX) * scaleX;
                sampled[i * 3 + 1] = (p.y + jitterY) * scaleY;
                sampled[i * 3 + 2] = 0; // Z is zero for now, we'll add random Z in particle-logo.js
            }
            
            resolve(sampled);
        };
        
        img.onerror = () => {
            reject(new Error("Failed to load SVG for particles"));
        };
        
        img.src = url;
    });
}
