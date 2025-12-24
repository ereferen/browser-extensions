import { useState } from 'react';
import type { Bookmark } from '../../utils/storage';
import styles from './Bookmarks.module.css';

interface BookmarkEditorProps {
  bookmark: Bookmark;
  isNew: boolean;
  onSave: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const PRESET_COLORS = [
  '#C9A227', // Gold
  '#4285F4', // Blue
  '#34A853', // Green
  '#EA4335', // Red
  '#FBBC04', // Yellow
  '#9334E6', // Purple
  '#00ACC1', // Cyan
  '#F06292', // Pink
];

export function BookmarkEditor({ bookmark, isNew, onSave, onDelete, onCancel }: BookmarkEditorProps) {
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);
  const [color, setColor] = useState(bookmark.color || PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onSave({
      ...bookmark,
      title: title.trim(),
      url: formattedUrl,
      color,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.editorBackdrop} onClick={handleBackdropClick}>
      <div className={styles.editor}>
        <h3 className={styles.editorTitle}>
          {isNew ? 'Add Traveler' : 'Edit Traveler'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>Name</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter name..."
              className={styles.input}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="url" className={styles.label}>Destination</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Emblem Color</label>
            <div className={styles.colorPicker}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorOption} ${color === c ? styles.colorSelected : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.editorActions}>
            {!isNew && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => onDelete(bookmark.id)}
              >
                Dismiss
              </button>
            )}
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
            >
              {isNew ? 'Recruit' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
