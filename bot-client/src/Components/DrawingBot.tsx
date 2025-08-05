import React, { useState, useCallback, useRef } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import DrawingCanvas from "./DrawingCanvas";
import { Command } from "../types";
import ImageSelectorModal from "./ImageSelectorModal";
import SaveImageDialog from "./SaveImageDialog";
import "./DrawingBot.css";
import * as drawingService from "../Services/drawingService";

type Message = {
  role: "user" | "bot" | "loading";
  content: string;
};
const DrawingBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [drawingHistory, setDrawingHistory] = useState<Command[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  // משתמשים ב-ref כדי לגשת לקנבס לצורך הורדה
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentDrawing = historyIndex >= 0 ? drawingHistory[historyIndex] : [];

  const setBotMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const filtered = prev.filter((m) => m.role !== "loading");
      return [...filtered, { role: "bot", content }];
    });
  }, []);

  const handleSend = useCallback(async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "loading", content: "הבוט חושב..." }]);
    setIsDrawing(true);

    try {
      const data = await drawingService.interpretPrompt(text, drawingHistory);

      const commands: Command[] = Array.isArray(data.commands)
        ? data.commands
        : Array.isArray(data.shapes)
        ? data.shapes
        : [];

      const previous = historyIndex >= 0 ? drawingHistory[historyIndex] : [];
      const combined = [...previous, ...commands];

      setDrawingHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(combined);
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });

      setBotMessage(data.text);
    } catch (error) {
      setBotMessage("שגיאה ביצירת הציור");
    } finally {
      setIsDrawing(false);
    }
  }, [drawingHistory, historyIndex, setBotMessage]);

  const handleUndo = useCallback(() => {
    setHistoryIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleRedo = useCallback(() => {
    setHistoryIndex((prev) => (prev < drawingHistory.length - 1 ? prev + 1 : prev));
  }, [drawingHistory.length]);

  const handleClear = useCallback(() => {
    setDrawingHistory([]);
    setHistoryIndex(-1);
    setMessages((prev) => [...prev, { role: "bot", content: "הציור נמחק" }]);
  }, []);

  const openSaveDialog = useCallback(() => setIsSaveDialogOpen(true), []);
  const closeSaveDialog = useCallback(() => setIsSaveDialogOpen(false), []);

  const saveImageToApi = useCallback(
    async (imageName: string) => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("אין משתמש מחובר");
        return;
      }

      const imageDto = {
        name: imageName,
        userId: parseInt(userId, 10),
        commands: drawingHistory.flat(),
      };

      setIsDrawing(true);
      try {
        await drawingService.saveImage(imageDto);
        closeSaveDialog();
      } catch (error) {
        alert("שגיאה בשמירה: " + error);
      } finally {
        setIsDrawing(false);
      }
    },
    [drawingHistory, closeSaveDialog]
  );

  const handleImageSelect = useCallback(
    async (id: number) => {
      setIsDrawing(true);
      try {
        const data = await drawingService.getImageById(id);

        if (!Array.isArray(data.commands)) {
          alert("שגיאה: מבנה הנתונים לא תקין");
          return;
        }

        setDrawingHistory((prev) => {
          const newHistory = [...prev.slice(0, historyIndex + 1), data.commands];
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
        });

        setMessages((prev) => [...prev, { role: "bot", content: "ציור נטען בהצלחה!" }]);
        setModalOpen(false);
      } catch (err) {
        alert("שגיאה בטעינת הציור: " + err);
      } finally {
        setIsDrawing(false);
      }
    },
    [historyIndex]
  );

  // פונקציית הורדת התמונה
  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    const imageUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "drawing.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  return (
    <>
 
      <div className="drawing-bot-container">
        <div className="sidebar">
          <ChatWindow messages={messages} />
          <ChatInput onSend={handleSend} disabled={isDrawing} />
        </div>

        <div className="main-content">
          {/* מוסיפים ref ל-DrawingCanvas */}
          <DrawingCanvas ref={canvasRef} commands={currentDrawing} />
          <div className="buttons-row">
            <button onClick={handleUndo} disabled={historyIndex <= 0} className="button-green">
              בטל
            </button>
            <button onClick={handleRedo} className="button-green" disabled={historyIndex >= drawingHistory.length - 1}>
              בצע שוב
            </button>
            <button onClick={handleClear} className="button-green">נקה</button>
            <button onClick={openSaveDialog} className="button-green">שמור</button>
            <button onClick={() => setModalOpen(true)} className="button-green">טען</button>
            <button onClick={handleDownload} className="button-green">הורד</button>
          </div>
        </div>
      </div>

      <SaveImageDialog isOpen={isSaveDialogOpen} onClose={closeSaveDialog} onSave={saveImageToApi} loading={isDrawing} />

      <ImageSelectorModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onImageSelect={handleImageSelect} />
    </>
  );
};

 export default DrawingBot;
// import React, { useState, useCallback } from "react";
// import ChatWindow from "./ChatWindow";
// import ChatInput from "./ChatInput";
// import DrawingCanvas from "./DrawingCanvas";
// import { Command } from "../types";
// import ImageSelectorModal from "./ImageSelectorModal";
// import SaveImageDialog from "./SaveImageDialog";
// import "./DrawingBot.css";

// type Message = {
//   role: "user" | "bot" | "loading";
//   content: string;
// };

// const DrawingBot: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [drawingHistory, setDrawingHistory] = useState<Command[][]>([]);
//   const [historyIndex, setHistoryIndex] = useState<number>(-1);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);

//   const currentDrawing = historyIndex >= 0 ? drawingHistory[historyIndex] : [];

//   const setBotMessage = useCallback((content: string) => {
//     setMessages((prev) => {
//       const filtered = prev.filter((m) => m.role !== "loading");
//       return [...filtered, { role: "bot", content }];
//     });
//   }, []);

//   const handleSend = useCallback(async (text: string) => {
//     setMessages((prev) => [...prev, { role: "user", content: text }, { role: "loading", content: "הבוט חושב..." }]);
//     setIsDrawing(true);

//     try {
//       const response = await fetch("https://localhost:7214/api/DrawingPrompt/interpret-prompt", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prompt: text,
//           existingCommands: drawingHistory,
//         }),
//       });

//       const data = await response.json();

//       const commands: Command[] = Array.isArray(data.commands)
//         ? data.commands
//         : Array.isArray(data.shapes)
//         ? data.shapes
//         : [];

//       const previous = historyIndex >= 0 ? drawingHistory[historyIndex] : [];
//       const combined = [...previous, ...commands];

//       setDrawingHistory((prev) => {
//         const newHistory = prev.slice(0, historyIndex + 1);
//         newHistory.push(combined);
//         setHistoryIndex(newHistory.length - 1);
//         return newHistory;
//       });

//       setBotMessage("הציור מוכן!");
//     } catch (error) {
//       setBotMessage("שגיאה ביצירת הציור");
//     } finally {
//       setIsDrawing(false);
//     }
//   }, [drawingHistory, historyIndex, setBotMessage]);

//   const handleUndo = useCallback(() => {
//     setHistoryIndex((prev) => (prev > 0 ? prev - 1 : prev));
//   }, []);

//   const handleRedo = useCallback(() => {
//     setHistoryIndex((prev) => (prev < drawingHistory.length - 1 ? prev + 1 : prev));
//   }, [drawingHistory.length]);

//   const handleClear = useCallback(() => {
//     setDrawingHistory([]);
//     setHistoryIndex(-1);
//     setMessages((prev) => [...prev, { role: "bot", content: "הציור נמחק" }]);
//   }, []);

//   const openSaveDialog = useCallback(() => setIsSaveDialogOpen(true), []);
//   const closeSaveDialog = useCallback(() => setIsSaveDialogOpen(false), []);

//   const saveImageToApi = useCallback(
//     async (imageName: string) => {
//       const userId = localStorage.getItem("user");
//       if (!userId) {
//         alert("אין משתמש מחובר");
//         return;
//       }

//       const imageDto = {
//         name: imageName,
//         userId: parseInt(userId, 10),
//         commands: drawingHistory.flat(),
//       };

//       setIsDrawing(true);
//       try {
//         const response = await fetch("https://localhost:7214/api/Drawing/image", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(imageDto),
//         });

//         if (response.ok) {
//           alert("התמונה נשמרה בהצלחה!");
//           closeSaveDialog();
//         } else {
//           const errorData = await response.json();
//           alert("שגיאה בשמירה: " + (errorData.message || response.statusText));
//         }
//       } catch (error) {
//         alert("שגיאה בשמירה: " + error);
//       } finally {
//         setIsDrawing(false);
//       }
//     },
//     [drawingHistory, closeSaveDialog]
//   );

//   const handleImageSelect = useCallback(
//     async (id: number) => {
//       setIsDrawing(true);
//       try {
//         const res = await fetch(`https://localhost:7214/api/Drawing/image/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch drawing commands");
//         const data = await res.json();

//         if (!Array.isArray(data.commands)) {
//           alert("שגיאה: מבנה הנתונים לא תקין");
//           return;
//         }

//         setDrawingHistory((prev) => {
//           const newHistory = [...prev.slice(0, historyIndex + 1), data.commands];
//           setHistoryIndex(newHistory.length - 1);
//           return newHistory;
//         });

//         setMessages((prev) => [...prev, { role: "bot", content: "ציור נטען בהצלחה!" }]);
//         setModalOpen(false);
//       } catch (err) {
//         alert("שגיאה בטעינת הציור: " + err);
//       } finally {
//         setIsDrawing(false);
//       }
//     },
//     [historyIndex]
//   );

//   return (
//     <>
//       <div className="drawing-bot-container">
//         <div className="sidebar">
//           <ChatWindow messages={messages} />
//           <ChatInput onSend={handleSend} disabled={isDrawing} />
//         </div>

//         <div className="main-content">
//           <DrawingCanvas commands={currentDrawing} className="canvas-container" />
//           <div className="buttons-row">
//             <button onClick={handleUndo} disabled={historyIndex <= 0}>
//               בטל
//             </button>
//             <button onClick={handleRedo} disabled={historyIndex >= drawingHistory.length - 1}>
//               בצע שוב
//             </button>
//             <button onClick={handleClear}>נקה</button>
//             <button onClick={openSaveDialog}>
//               💾 שמור
//             </button>
//             <button onClick={() => setModalOpen(true)} className="button-green">טען</button>
//           </div>
//         </div>
//       </div>

//       <SaveImageDialog isOpen={isSaveDialogOpen} onClose={closeSaveDialog} onSave={saveImageToApi} loading={isDrawing} />

//       <ImageSelectorModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onImageSelect={handleImageSelect} />
//     </>
//   );
// };

// export default DrawingBot;
