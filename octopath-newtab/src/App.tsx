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

      <aside className={styles.leftSidebar}>
        <Bookmarks />
      </aside>

      <main className={styles.main}>
        <section className={styles.center}>
          <h1 className={styles.title}>Octopath</h1>
          <SearchBar />
        </section>

        <footer className={styles.footer}>
          <span className={styles.hint}>
            Press <kbd>/</kbd> to search · Right-click bookmark to edit
          </span>
        </footer>
      </main>

      <aside className={styles.rightSidebar}>
        <header className={styles.weatherSection}>
          <Weather />
        </header>
        <section className={styles.newsSection}>
          <NewsFeed />
        </section>
      </aside>
    </div>
  );
}

export default App;
