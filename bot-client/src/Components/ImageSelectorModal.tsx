import React, { useEffect, useState, useCallback } from "react";
import * as drawingService from "../Services/drawingService";
import "./ImageSelectorModal.css"; // 🔹 ייבוא קובץ ה-CSS

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (drawingId: number) => Promise<void>;
}

interface DrawingSummary {
  id: number;
  name: string;
  userId: number;
}

const ImageSelectorModal: React.FC<ImageSelectorModalProps> = ({ isOpen, onClose, onImageSelect }) => {
  const [drawings, setDrawings] = useState<DrawingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchDrawings = async () => {
      setLoading(true);
      try {
        const data = await drawingService.fetchUserDrawings(userId);
        setDrawings(data);
      } catch (err) {
        alert("שגיאה בטעינת הציורים: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawings();
  }, [isOpen, userId]);

  const handleSelect = useCallback(async (id: number) => {
    await onImageSelect(id);
  }, [onImageSelect]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="image-selector-modal" role="dialog" aria-modal="true">
        <h3>בחר ציור</h3>
        {loading && <p className="loading">טוען ציורים...</p>}
        {!loading && (
          <ul>
            {drawings.map((drawing) => (
              <li key={drawing.id}>
                <button className="select-button" onClick={() => handleSelect(drawing.id)}>
                  {drawing.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className="close-button" onClick={onClose} disabled={loading}>סגור</button>
      </div>
    </div>
  );
};

export default ImageSelectorModal;
