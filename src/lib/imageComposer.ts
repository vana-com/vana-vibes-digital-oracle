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

    // Background gradient matching app design - midnight gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'hsl(238, 42%, 21%)'); // --background
    gradient.addColorStop(1, 'hsl(238, 35%, 25%)'); // --card
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add mystical border using design system gold
    ctx.strokeStyle = 'hsl(50, 60%, 56%)'; // --primary (mystic gold)
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Title text styling using design system colors
    ctx.fillStyle = 'hsl(50, 60%, 56%)'; // --primary
    ctx.textAlign = 'center';
    ctx.font = 'bold 44px serif';
    ctx.fillText('THE DIGITAL ORACLE SPEAKS', canvas.width / 2, 55);

    // Subtitle using secondary color
    ctx.font = '20px serif';
    ctx.fillStyle = 'hsl(240, 98%, 76%)'; // --secondary
    ctx.fillText('✧ YOUR CAREER FORTUNE REVEALED ✧', canvas.width / 2, 85);

    // Card dimensions and positioning - optimized for better space usage
    const cardWidth = 220;
    const cardHeight = 330;
    const cardSpacing = 90;
    const totalCardsWidth = (cardWidth * 3) + (cardSpacing * 2);
    const startX = (canvas.width - totalCardsWidth) / 2;
    const cardY = 130;

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
        
        // Draw card border using design system gold
        ctx.fillStyle = 'hsl(50, 60%, 56%)'; // --primary
        ctx.fillRect(x - 3, cardY - 3, cardWidth + 6, cardHeight + 6);
        
        // Draw card image
        ctx.drawImage(img, x, cardY, cardWidth, cardHeight);
        
        // Draw position label above card
        ctx.fillStyle = 'hsl(50, 60%, 56%)'; // --primary
        ctx.font = 'bold 18px serif';
        ctx.textAlign = 'center';
        ctx.fillText(positions[index], x + cardWidth / 2, cardY - 15);
        
        // Draw card name below card
        ctx.fillStyle = 'hsl(240, 98%, 76%)'; // --secondary
        ctx.font = '16px serif';
        const cardName = card.name.length > 22 ? card.name.substring(0, 22) + '...' : card.name;
        ctx.fillText(cardName, x + cardWidth / 2, cardY + cardHeight + 20);
        
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
        ctx.fillStyle = 'hsl(238, 35%, 25%)'; // --card
        ctx.fillRect(x, cardY, cardWidth, cardHeight);
        ctx.fillStyle = 'hsl(50, 60%, 56%)'; // --primary
        ctx.font = '18px serif';
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
  // Add mystical symbols in corners using design system colors
  ctx.fillStyle = 'hsl(50, 60%, 56%)'; // --primary
  ctx.font = '24px serif';
  ctx.textAlign = 'left';
  
  // Top corners
  ctx.fillText('✧', 25, 40);
  ctx.textAlign = 'right';
  ctx.fillText('✧', width - 25, 40);
  
  // Bottom corners
  ctx.textAlign = 'left';
  ctx.fillText('✧', 25, height - 20);
  ctx.textAlign = 'right';
  ctx.fillText('✧', width - 25, height - 20);
  
  // Add mystical runes at bottom using secondary color
  ctx.textAlign = 'center';
  ctx.font = '16px serif';
  ctx.fillStyle = 'hsl(240, 98%, 76%)'; // --secondary
  ctx.fillText('ᚨᚾᚲᛁᛖᚾᛏ • ᚹᛁᛋᛞᛟᛗ • ᚱᛖᚢᛖᚨᛚᛖᛞ', width / 2, height - 30);
}

export const downloadImage = (dataUrl: string, filename: string = 'tarot-reading.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};