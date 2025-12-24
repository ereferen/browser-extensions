import { useState, useEffect, useCallback } from 'react';
import type { Bookmark } from '../../utils/storage';
import { getBookmarks, saveBookmarks, generateId } from '../../utils/storage';
import { BookmarkItem } from './BookmarkItem';
import { BookmarkEditor } from './BookmarkEditor';
import styles from './Bookmarks.module.css';

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    getBookmarks().then(setBookmarks);
  }, []);

  const handleSave = useCallback(async (bookmark: Bookmark) => {
    let updated: Bookmark[];
    if (isAdding) {
      updated = [...bookmarks, { ...bookmark, id: generateId() }];
    } else {
      updated = bookmarks.map((b) => (b.id === bookmark.id ? bookmark : b));
    }
    setBookmarks(updated);
    await saveBookmarks(updated);
    setEditingBookmark(null);
    setIsAdding(false);
  }, [bookmarks, isAdding]);

  const handleDelete = useCallback(async (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    await saveBookmarks(updated);
    setEditingBookmark(null);
  }, [bookmarks]);

  const handleAdd = useCallback(() => {
    if (bookmarks.length >= 8) return;
    setIsAdding(true);
    setEditingBookmark({
      id: '',
      title: '',
      url: '',
      color: '#C9A227',
    });
  }, [bookmarks.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const maxIndex = Math.min(bookmarks.length, 8) - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, maxIndex)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === null ? maxIndex : Math.max(prev - 1, 0)
        );
        break;
      case 'Enter':
        if (selectedIndex !== null && bookmarks[selectedIndex]) {
          window.location.href = bookmarks[selectedIndex].url;
        }
        break;
    }
  }, [bookmarks, selectedIndex]);

  return (
    <div className={styles.container} onKeyDown={handleKeyDown} tabIndex={0}>
      <h2 className={styles.title}>Travelers</h2>

      <div className={styles.grid}>
        {bookmarks.slice(0, 8).map((bookmark, index) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            isSelected={selectedIndex === index}
            onSelect={() => setSelectedIndex(index)}
            onEdit={() => setEditingBookmark(bookmark)}
          />
        ))}

        {bookmarks.length < 8 && (
          <button
            className={styles.addButton}
            onClick={handleAdd}
            aria-label="Add bookmark"
          >
            <span className={styles.addIcon}>+</span>
            <span className={styles.addText}>Add</span>
          </button>
        )}
      </div>

      {editingBookmark && (
        <BookmarkEditor
          bookmark={editingBookmark}
          isNew={isAdding}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => {
            setEditingBookmark(null);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
}
