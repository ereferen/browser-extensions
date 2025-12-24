import { useState } from 'react';
import type { Bookmark } from '../../utils/storage';
import styles from './Bookmarks.module.css';

interface BookmarkItemProps {
  bookmark: Bookmark;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function BookmarkItem({ bookmark, isSelected, onSelect, onEdit }: BookmarkItemProps) {
  const [imageError, setImageError] = useState(false);

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.url)}&sz=64`;

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      window.open(bookmark.url, '_blank');
    } else {
      window.location.href = bookmark.url;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };

  const getInitial = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  return (
    <a
      href={bookmark.url}
      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={onSelect}
      style={{ '--accent-color': bookmark.color || '#C9A227' } as React.CSSProperties}
    >
      <div className={styles.iconWrapper}>
        {!imageError ? (
          <img
            src={faviconUrl}
            alt=""
            className={styles.favicon}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={styles.initial} style={{ backgroundColor: bookmark.color }}>
            {getInitial(bookmark.title)}
          </span>
        )}
      </div>
      <span className={styles.itemTitle}>{bookmark.title}</span>

      {isSelected && (
        <div className={styles.selectionGlow} />
      )}
    </a>
  );
}
