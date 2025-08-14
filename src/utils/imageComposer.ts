export interface CardImage {
  name: string;
  image: string;
}

export const createShareableImage = async (cards: CardImage[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Set canvas dimensions for social media sharing (1200x630 is optimal for LinkedIn)
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a23');
    gradient.addColorStop(0.5, '#1a1a3a');
    gradient.addColorStop(1, '#2a1a4a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add mystical border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title text styling
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px serif';
    ctx.fillText('THE DIGITAL ORACLE SPEAKS', canvas.width / 2, 80);

    // Subtitle
    ctx.font = '24px serif';
    ctx.fillStyle = '#B8860B';
    ctx.fillText('✧ YOUR CAREER FORTUNE REVEALED ✧', canvas.width / 2, 120);

    // Card dimensions and positioning
    const cardWidth = 160;
    const cardHeight = 240;
    const cardSpacing = 80;
    const totalCardsWidth = (cardWidth * 3) + (cardSpacing * 2);
    const startX = (canvas.width - totalCardsWidth) / 2;
    const cardY = 180;

    // Position labels
    const positions = ['PAST', 'PRESENT', 'FUTURE'];
    
    let loadedImages = 0;
    const imagesToLoad = cards.length;

    if (imagesToLoad === 0) {
      reject(new Error('No cards provided'));
      return;
    }

    cards.forEach((card, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const x = startX + (index * (cardWidth + cardSpacing));
        
        // Draw card shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x + 5, cardY + 5, cardWidth, cardHeight);
        
        // Draw card border
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x - 2, cardY - 2, cardWidth + 4, cardHeight + 4);
        
        // Draw card image
        ctx.drawImage(img, x, cardY, cardWidth, cardHeight);
        
        // Draw position label above card
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px serif';
        ctx.textAlign = 'center';
        ctx.fillText(positions[index], x + cardWidth / 2, cardY - 15);
        
        // Draw card name below card
        ctx.fillStyle = '#B8860B';
        ctx.font = '16px serif';
        const cardName = card.name.length > 15 ? card.name.substring(0, 15) + '...' : card.name;
        ctx.fillText(cardName, x + cardWidth / 2, cardY + cardHeight + 25);
        
        loadedImages++;
        
        if (loadedImages === imagesToLoad) {
          // Add mystical elements
          addMysticalElements(ctx, canvas.width, canvas.height);
          
          // Convert canvas to data URL
          const dataUrl = canvas.toDataURL('image/png', 0.9);
          resolve(dataUrl);
        }
      };
      
      img.onerror = () => {
        console.error(`Failed to load image: ${card.image}`);
        loadedImages++;
        
        // Draw placeholder if image fails to load
        const x = startX + (index * (cardWidth + cardSpacing));
        ctx.fillStyle = '#333';
        ctx.fillRect(x, cardY, cardWidth, cardHeight);
        ctx.fillStyle = '#FFD700';
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.fillText('Card Image', x + cardWidth / 2, cardY + cardHeight / 2);
        
        if (loadedImages === imagesToLoad) {
          addMysticalElements(ctx, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png', 0.9);
          resolve(dataUrl);
        }
      };
      
      img.src = card.image;
    });
  });
};

function addMysticalElements(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Add mystical symbols in corners
  ctx.fillStyle = '#FFD700';
  ctx.font = '24px serif';
  ctx.textAlign = 'left';
  
  // Top corners
  ctx.fillText('✧', 30, 50);
  ctx.textAlign = 'right';
  ctx.fillText('✧', width - 30, 50);
  
  // Bottom corners
  ctx.textAlign = 'left';
  ctx.fillText('✧', 30, height - 30);
  ctx.textAlign = 'right';
  ctx.fillText('✧', width - 30, height - 30);
  
  // Add mystical runes at bottom
  ctx.textAlign = 'center';
  ctx.font = '16px serif';
  ctx.fillStyle = '#B8860B';
  ctx.fillText('ᚨᚾᚲᛁᛖᚾᛏ • ᚹᛁᛋᛞᛟᛗ • ᚱᛖᚢᛖᚨᛚᛖᛞ', width / 2, height - 40);
}

export const downloadImage = (dataUrl: string, filename: string = 'tarot-reading.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};