import React from 'react';

const DrawingPreview = ({ drawing, height, width }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw lines
            drawing.lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line.points[0][0], line.points[0][1]);
                line.points.slice(1).forEach(point => {
                    ctx.lineTo(point[0], point[1]);
                });
                ctx.strokeStyle = line.color;
                ctx.lineWidth = line.width;
                ctx.stroke();
            });

            // Draw shapes
            drawing.shapes.forEach(shape => {
                ctx.fillStyle = shape.color;
                if (shape.type === 'rectangle') {
                    ctx.fillRect(shape.position.x, shape.position.y, shape.size.width, shape.size.height);
                } else if (shape.type === 'circle') {
                    ctx.beginPath();
                    ctx.arc(shape.position.x, shape.position.y, shape.radius, 0, 2 * Math.PI);
                    ctx.fill();
                }
            });

            // Draw texts
            drawing.texts.forEach(text => {
                ctx.font = `${text.fontSize}px Arial`;
                ctx.fillStyle = text.color;
                ctx.fillText(text.content, text.position.x, text.position.y);
            });
        }
    }, [drawing]);

    return <canvas ref={canvasRef} height={height} width={width} />;
};

export default DrawingPreview;