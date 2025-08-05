import React, { useState, useCallback } from "react";
import "./SaveImageDialog.css"; // הוסף קובץ CSS נפרד

interface SaveImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageName: string) => Promise<void>;
  loading: boolean;
}

const SaveImageDialog: React.FC<SaveImageDialogProps> = ({ isOpen, onClose, onSave, loading }) => {
  const [imageName, setImageName] = useState("");

  const handleSave = useCallback(() => {
    if (imageName.trim()) {
      onSave(imageName.trim());
    } else {
      alert("אנא הזן שם תקין לתמונה");
    }
  }, [imageName, onSave]);

  const handleClose = useCallback(() => {
    setImageName("");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="save-dialog" role="dialog" aria-modal="true">
        <h3>הכנס שם לתמונה לשמירה</h3>
        <input
          type="text"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          autoFocus
          disabled={loading}
        />
        <div className="buttons">
          <button onClick={handleClose} disabled={loading}>בטל</button>
          <button onClick={handleSave} disabled={loading}>שמור</button>
        </div>
      </div>
    </div>
  );
};

export default SaveImageDialog;
