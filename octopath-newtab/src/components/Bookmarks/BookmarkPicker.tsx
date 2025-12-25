import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './BookmarkPicker.module.css';

interface ChromeBookmark {
  id: string;
  title: string;
  url?: string;
  children?: ChromeBookmark[];
}

interface BookmarkPickerProps {
  onSelect: (url: string, title: string) => void;
  onCancel: () => void;
}

export function BookmarkPicker({ onSelect, onCancel }: BookmarkPickerProps) {
  const [bookmarks, setBookmarks] = useState<ChromeBookmark[]>([]);
  const [currentFolder, setCurrentFolder] = useState<ChromeBookmark | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<ChromeBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        const tree = await chrome.bookmarks.getTree();
        setBookmarks(tree);
      } else {
        console.warn('Chrome bookmarks API not available');
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToFolder = (folder: ChromeBookmark | null) => {
    setCurrentFolder(folder);
    if (folder) {
      const newBreadcrumbs = [...breadcrumbs];
      const existingIndex = newBreadcrumbs.findIndex(b => b.id === folder.id);
      if (existingIndex >= 0) {
        // Going back in breadcrumbs
        setBreadcrumbs(newBreadcrumbs.slice(0, existingIndex + 1));
      } else {
        // Going forward
        setBreadcrumbs([...newBreadcrumbs, folder]);
      }
    } else {
      setBreadcrumbs([]);
    }
  };

  const getCurrentItems = (): ChromeBookmark[] => {
    if (!currentFolder) {
      return bookmarks;
    }
    return currentFolder.children || [];
  };

  const handleSelect = (bookmark: ChromeBookmark) => {
    if (bookmark.url) {
      onSelect(bookmark.url, bookmark.title);
    } else if (bookmark.children) {
      navigateToFolder(bookmark);
    }
  };

  const modalContent = loading ? (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.loading}>Loading bookmarks...</div>
      </div>
    </div>
  ) : (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Select from Chrome Bookmarks</h3>
          <button className={styles.closeButton} onClick={onCancel}>×</button>
        </div>

        <div className={styles.breadcrumbs}>
          <button
            className={styles.breadcrumb}
            onClick={() => navigateToFolder(null)}
          >
            🏠 Root
          </button>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.id}>
              <span className={styles.separator}>›</span>
              <button
                className={styles.breadcrumb}
                onClick={() => navigateToFolder(crumb)}
              >
                {crumb.title || 'Untitled'}
              </button>
            </span>
          ))}
        </div>

        <div className={styles.list}>
          {getCurrentItems().map((item) => (
            <button
              key={item.id}
              className={`${styles.item} ${item.url ? styles.bookmark : styles.folder}`}
              onClick={() => handleSelect(item)}
            >
              <span className={styles.icon}>
                {item.url ? '🔖' : '📁'}
              </span>
              <span className={styles.itemTitle}>{item.title || 'Untitled'}</span>
            </button>
          ))}
          {getCurrentItems().length === 0 && (
            <div className={styles.empty}>No bookmarks in this folder</div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
