import { Background } from './components/Background';
import { Bookmarks } from './components/Bookmarks';
import { SearchBar } from './components/SearchBar';
import { Weather } from './components/Weather';
import { NewsFeed } from './components/NewsFeed';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <Background />

      <main className={styles.main}>
        <header className={styles.header}>
          <Weather />
        </header>

        <section className={styles.center}>
          <h1 className={styles.title}>Octopath</h1>
          <SearchBar />
        </section>

        <section className={styles.bookmarks}>
          <Bookmarks />
        </section>

        <aside className={styles.sidebar}>
          <NewsFeed />
        </aside>
      </main>

      <footer className={styles.footer}>
        <span className={styles.hint}>
          Press <kbd>/</kbd> to search · Right-click bookmark to edit
        </span>
      </footer>
    </div>
  );
}

export default App;
