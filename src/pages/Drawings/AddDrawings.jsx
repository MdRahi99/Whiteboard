import React, { useState, useRef, useEffect } from 'react';
import { useCreateDrawing } from '../../hooks/useDrawings';
import { Pencil, Square, Circle, Type, Trash2, Save, Undo } from 'lucide-react';

const AddDrawings = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [title, setTitle] = useState('');
  const [shapes, setShapes] = useState([]);
  const [texts, setTexts] = useState([]);
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  const [history, setHistory] = useState([]);

  const createDrawingMutation = useCreateDrawing();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);
  }, []);

  useEffect(() => {
    drawOnCanvas();
  }, [lines, shapes, texts, currentLine]);

  const startDrawing = (e) => {
    setDrawing(true);
    const pos = getMousePos(e);
    if (tool === 'pencil') {
      setCurrentLine([[pos.x, pos.y]]);
    } else if (tool === 'rectangle' || tool === 'circle') {
      setCurrentLine([[pos.x, pos.y]]);
    }
  };

  const draw = (e) => {
    if (!drawing) return;
    const pos = getMousePos(e);

    if (tool === 'pencil') {
      setCurrentLine(prevLine => [...prevLine, [pos.x, pos.y]]);
    } else if (tool === 'rectangle' || tool === 'circle') {
      setCurrentLine(prevLine => [prevLine[0], [pos.x, pos.y]]);
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (currentLine.length > 0) {
      if (tool === 'pencil') {
        setLines(prevLines => {
          const newLines = [...prevLines, { points: currentLine, color, width: lineWidth }];
          setHistory(prev => [...prev, { lines: prevLines, shapes, texts }]);
          return newLines;
        });
      } else if (tool === 'rectangle') {
        const [start, end] = currentLine;
        setShapes(prevShapes => {
          const newShapes = [...prevShapes, {
            type: 'rectangle',
            position: { x: Math.min(start[0], end[0]), y: Math.min(start[1], end[1]) },
            size: { 
              width: Math.abs(end[0] - start[0]), 
              height: Math.abs(end[1] - start[1]) 
            },
            color
          }];
          setHistory(prev => [...prev, { lines, shapes: prevShapes, texts }]);
          return newShapes;
        });
      } else if (tool === 'circle') {
        const [start, end] = currentLine;
        const radius = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
        setShapes(prevShapes => {
          const newShapes = [...prevShapes, {
            type: 'circle',
            position: { x: start[0], y: start[1] },
            radius,
            color
          }];
          setHistory(prev => [...prev, { lines, shapes: prevShapes, texts }]);
          return newShapes;
        });
      }
    }
    setCurrentLine([]);
  };

  const drawOnCanvas = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw existing lines
    lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.points[0][0], line.points[0][1]);
      line.points.slice(1).forEach(point => {
        ctx.lineTo(point[0], point[1]);
      });
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.stroke();
    });

    // Draw existing shapes
    shapes.forEach(shape => {
      ctx.fillStyle = shape.color;
      if (shape.type === 'rectangle') {
        ctx.fillRect(shape.position.x, shape.position.y, shape.size.width, shape.size.height);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.position.x, shape.position.y, shape.radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw existing texts
    texts.forEach(text => {
      ctx.font = `${text.fontSize}px Arial`;
      ctx.fillStyle = text.color;
      ctx.fillText(text.content, text.position.x, text.position.y);
    });

    // Draw current line without initial indicator
    if (currentLine.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentLine[0][0], currentLine[0][1]);
      currentLine.slice(1).forEach(point => {
        ctx.lineTo(point[0], point[1]);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      if (tool === 'rectangle' && currentLine.length === 2) {
        const [start, end] = currentLine;
        ctx.strokeRect(
          Math.min(start[0], end[0]),
          Math.min(start[1], end[1]),
          Math.abs(end[0] - start[0]),
          Math.abs(end[1] - start[1])
        );
      } else if (tool === 'circle' && currentLine.length === 2) {
        const [start, end] = currentLine;
        const radius = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
        ctx.beginPath();
        ctx.arc(start[0], start[1], radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const addText = () => {
    const content = prompt('Enter text:');
    if (content) {
      setTexts(prevTexts => {
        const newTexts = [...prevTexts, {
          content,
          position: { x: 100, y: 100 },
          fontSize: 16,
          color
        }];
        setHistory(prev => [...prev, { lines, shapes, texts: prevTexts }]);
        return newTexts;
      });
    }
  };

  const clearCanvas = () => {
    setHistory(prev => [...prev, { lines, shapes, texts }]);
    setLines([]);
    setShapes([]);
    setTexts([]);
    setCurrentLine([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setLines(prevState.lines);
      setShapes(prevState.shapes);
      setTexts(prevState.texts);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const saveDrawing = () => {
    if (title.trim() === '') {
      alert('Please enter a title for your drawing.');
      return;
    }

    const drawingData = {
      title,
      lines,
      shapes,
      texts
    };

    createDrawingMutation.mutate(drawingData, {
      onSuccess: () => {
        alert('Drawing saved successfully!');
        clearCanvas();
        setTitle('');
        setHistory([]);
      },
      onError: (error) => {
        alert(`Error saving drawing: ${error.message}`);
      }
    });
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Drawing</h2>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter drawing title"
          className="w-[40%] p-2 border border-gray-300 focus:outline-none rounded"
        />
      </div>
      <div className="flex space-x-4 mb-8 items-center justify-end">
        <button onClick={() => setTool('pencil')} className={`p-2 ${tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>
          <Pencil size={20} />
        </button>
        <button onClick={() => setTool('rectangle')} className={`p-2 ${tool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>
          <Square size={20} />
        </button>
        <button onClick={() => setTool('circle')} className={`p-2 ${tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>
          <Circle size={20} />
        </button>
        <button onClick={addText} className="p-2 bg-gray-200 rounded">
          <Type size={20} />
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="p-1 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          min="1"
          max="20"
          className="w-16 p-1 border border-gray-300 rounded"
        />
        <button onClick={undo} className="p-2 bg-yellow-500 text-white rounded" disabled={history.length === 0}>
          <Undo size={20} />
        </button>
        <button onClick={clearCanvas} className="p-2 bg-red-500 text-white rounded">
          <Trash2 size={20} />
        </button>
        <button onClick={saveDrawing} className="p-2 bg-green-500 text-white rounded">
          <Save size={20} />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={1400}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="border border-gray-300 rounded"
      />
    </div>
  );
};

export default AddDrawings;