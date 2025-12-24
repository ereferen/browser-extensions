import { useState, useEffect } from 'react';
import type { NewsItem } from '../../utils/api';
import { fetchNews } from '../../utils/api';
import styles from './NewsFeed.module.css';

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Bulletin Board</h3>
        <div className={styles.loading}>
          <div className={styles.shimmer} />
          <div className={styles.shimmer} />
          <div className={styles.shimmer} />
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Bulletin Board</h3>
        <p className={styles.empty}>No news available</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Bulletin Board</h3>

      <div className={styles.list}>
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
          >
            <span className={styles.itemIcon}>📜</span>
            <div className={styles.itemContent}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemMeta}>
                {item.source} · {item.pubDate}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
