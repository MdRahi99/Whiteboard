import React, { useState, useRef, useEffect } from 'react';
import { useCreateDrawing } from '../../hooks/useDrawings';
import { Pencil, Square, Circle, Type, Trash2, Save, Undo } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddDrawings = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
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
  const [canvasSize, setCanvasSize] = useState({ width: 1400, height: 400 });
  const navigate = useNavigate();

  const createDrawingMutation = useCreateDrawing();

  // Set canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);
  }, []);

  // Adjust canvas size responsively
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = width / 3.5; // Maintain aspect ratio (approx 16:4)
      setCanvasSize({ width, height });
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    drawOnCanvas();
  }, [lines, shapes, texts, currentLine, canvasSize]);

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

    // Draw current line
    if (currentLine.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentLine[0][0], currentLine[0][1]);
      currentLine.slice(1).forEach(point => {
        ctx.lineTo(point[0], point[1]);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (e.clientY - rect.top) * (canvasRef.current.height / rect.height)
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
      toast.warning('Please enter a title for your drawing.');
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
        toast.success('Drawing added successfully!');
        clearCanvas();
        setTitle('');
        setHistory([]);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      },
      onError: (error) => {
        toast.error(`Error saving drawing: ${error.message}`);
      }
    });
  };

  return (
    <div ref={containerRef} className="w-full max-w-full mx-auto p-6 bg-white rounded-xl">
      <ToastContainer position="top-center" autoClose={1000} />
      <h2 className="text-2xl font-bold mb-4">Create New Drawing</h2>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-2/5 focus:outline-none focus:border-indigo-600"
          placeholder="Drawing Title"
        />
      </div>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-4'>
        <div className="flex flex-wrap items-center gap-4">
          <Pencil onClick={() => setTool('pencil')} className={`cursor-pointer ${tool === 'pencil' && 'text-blue-500'}`} />
          <Square onClick={() => setTool('rectangle')} className={`cursor-pointer ${tool === 'rectangle' && 'text-blue-500'}`} />
          <Circle onClick={() => setTool('circle')} className={`cursor-pointer ${tool === 'circle' && 'text-blue-500'}`} />
          <Type onClick={addText} className="cursor-pointer" />
          <Trash2 onClick={clearCanvas} className="cursor-pointer" />
          <Undo onClick={undo} className="cursor-pointer" />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <div className="flex items-center gap-2">
            <label className="block text-gray-700">Line Width</label>
            <input type="number" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} className='border border-gray-300 focus:border-indigo-600 focus:outline-none pl-1' />
          </div>
        </div>
        <button
          onClick={saveDrawing}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          <Save className="mr-2 inline-block" /> Save Drawing
        </button>
      </div>
      <div className="border border-gray-300 focus:outline-none rounded-xl overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          className="border border-gray-300 cursor-crosshair"
        />
      </div>
    </div>
  );
};

export default AddDrawings;
