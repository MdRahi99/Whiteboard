import React from 'react';

const DrawingPreview = ({ drawing, height, width }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current && drawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      console.log('Drawing data:', drawing);

      // Calculate scaling factors
      const xMax = Math.max(...drawing.shapes.map(s => s.position.x + (s.size?.width || 0)));
      const yMax = Math.max(...drawing.shapes.map(s => s.position.y + (s.size?.height || 0)));
      const scaleX = width / (xMax || width);
      const scaleY = height / (yMax || height);
      const scale = Math.min(scaleX, scaleY, 1);

      ctx.save();
      ctx.scale(scale, scale);

      // Draw shapes
      if (Array.isArray(drawing.shapes)) {
        drawing.shapes.forEach(shape => {
          ctx.fillStyle = shape.color || '#000000';
          ctx.strokeStyle = shape.color || '#000000';
          ctx.lineWidth = 2;

          if (shape.type === 'rectangle' && shape.position && shape.size) {
            ctx.strokeRect(shape.position.x, shape.position.y, shape.size.width, shape.size.height);
            ctx.fillRect(shape.position.x, shape.position.y, shape.size.width, shape.size.height);
          } else if (shape.type === 'circle' && shape.position && shape.radius) {
            ctx.beginPath();
            ctx.arc(shape.position.x, shape.position.y, shape.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          }
        });
      }

      // Draw lines (if any)
      if (Array.isArray(drawing.lines)) {
        drawing.lines.forEach(line => {
          if (Array.isArray(line.points) && line.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(line.points[0][0], line.points[0][1]);
            line.points.slice(1).forEach(point => {
              ctx.lineTo(point[0], point[1]);
            });
            ctx.strokeStyle = line.color || '#000000';
            ctx.lineWidth = line.width || 1;
            ctx.stroke();
          }
        });
      }

      // Draw texts (if any)
      if (Array.isArray(drawing.texts)) {
        drawing.texts.forEach(text => {
          if (text.content && text.position) {
            ctx.font = `${text.fontSize || 16}px Arial`;
            ctx.fillStyle = text.color || '#000000';
            ctx.fillText(text.content, text.position.x, text.position.y);
          }
        });
      }

      ctx.restore();
    }
  }, [drawing, height, width]);

  return <canvas ref={canvasRef} height={height} width={width} />;
};

export default DrawingPreview;