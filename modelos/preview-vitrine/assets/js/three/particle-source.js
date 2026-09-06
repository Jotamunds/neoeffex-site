/**
 * Extracts points from an SVG image for the particle system.
 * Etapa 3.2 — Preserves exact silhouette with 512x512 rasterisation,
 * automatic bounding-box centering, and minimal XY jitter.
 */

export function loadSVGPixels(url, particleCount) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = () => {
            // Draw image to offscreen canvas with high resolution for crisp silhouette edges
            const canvas = document.createElement('canvas');
            const width = 512;
            const height = 512;
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, width, height);
            
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            
            const validPixels = [];
            
            // Collect all pixels that are mostly opaque
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const alpha = data[index + 3];
                    
                    if (alpha > 140) {
                        // Normalize coords between -0.5 and 0.5 (y positive is UP in 3D)
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
            
            // Section 29: Bounding box calculation & centering
            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            for (let i = 0; i < validPixels.length; i++) {
                const p = validPixels[i];
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            }
            
            const rawWidth = maxX - minX;
            const rawHeight = maxY - minY;
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            
            // Base geometry scale: height normalized to 1.0 in local coordinates
            const normScale = 1.0 / rawHeight;
            const bounds = {
                width: rawWidth * normScale,
                height: 1.0
            };
            
            // Sample exactly particleCount pixels
            const sampled = new Float32Array(particleCount * 3);
            
            // Section 7: Minimal XY jitter to preserve exact SVG silhouette
            const pixelStepX = (1 / width) * normScale;
            const pixelStepY = (1 / height) * normScale;
            
            for (let i = 0; i < particleCount; i++) {
                const randIndex = Math.floor(Math.random() * validPixels.length);
                const p = validPixels[randIndex];
                
                // Micro jitter within half a pixel to break grid alignment without blurring edges
                const jitterX = (Math.random() - 0.5) * pixelStepX * 0.9;
                const jitterY = (Math.random() - 0.5) * pixelStepY * 0.9;
                
                sampled[i * 3 + 0] = (p.x - centerX) * normScale + jitterX;
                sampled[i * 3 + 1] = (p.y - centerY) * normScale + jitterY;
                sampled[i * 3 + 2] = 0; // Z depth added in particle-logo.js
            }
            
            // Attach bounds directly to array for seamless API access
            sampled.bounds = bounds;
            
            resolve(sampled);
        };
        
        img.onerror = () => {
            reject(new Error("Failed to load SVG for particles"));
        };
        
        img.src = url;
    });
}
