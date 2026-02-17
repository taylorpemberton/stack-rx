import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogPosts, subreddits, categories } from '../data/blogPosts';
import { trackPageView } from '../analytics/gtag';
import { BASE_URL } from '../config';

export default function Blog() {
  const location = useLocation();
  const [activeSubreddit, setActiveSubreddit] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    trackPageView(location.pathname, 'Blog — StackRx');
  }, [location]);

  const filtered = blogPosts.filter((post) => {
    if (activeSubreddit !== 'all' && post.subreddit !== activeSubreddit) return false;
    if (activeCategory !== 'all' && post.category !== activeCategory) return false;
    return true;
  });

  return (
    <main className="blog-page">
      <SEO
        title="Blog"
        description="Top discussions from Reddit's peptide and biohacking communities. Curated threads from r/peptides, r/biohackers, and r/retatrutide."
        path="/blog"
        ogImage={`${BASE_URL}/og/default.png`}
      />

      <div className="blog-hero">
        <span className="blog-badge">BLOG</span>
        <h1>Blog</h1>
        <p>The most upvoted discussions from Reddit's peptide and biohacking communities.</p>
        <div className="blog-subreddit-links">
          {subreddits.map((sub) => (
            <a key={sub.name} href={sub.url} target="_blank" rel="noopener noreferrer" className="blog-subreddit-chip">
              {sub.name} <span className="blog-chip-members">{sub.members}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="blog-container">
        <div className="blog-filters">
          <div className="blog-filter-group">
            <label>Subreddit</label>
            <div className="blog-filter-pills">
              <button
                className={`blog-pill ${activeSubreddit === 'all' ? 'active' : ''}`}
                onClick={() => setActiveSubreddit('all')}
              >All</button>
              {subreddits.map((sub) => (
                <button
                  key={sub.name}
                  className={`blog-pill ${activeSubreddit === sub.name ? 'active' : ''}`}
                  onClick={() => setActiveSubreddit(sub.name)}
                >{sub.name}</button>
              ))}
            </div>
          </div>
          <div className="blog-filter-group">
            <label>Category</label>
            <div className="blog-filter-pills">
              <button
                className={`blog-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >All</button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`blog-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >{cat}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="blog-count">{filtered.length} thread{filtered.length !== 1 ? 's' : ''}</div>

        <div className="blog-list">
          {filtered.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-row"
            >
              <div className="blog-row-score">{post.score.toLocaleString()}</div>
              <div className="blog-row-body">
                <span className="blog-row-title">{post.title}</span>
                <span className="blog-row-meta">
                  <span className="blog-row-subreddit">{post.subreddit}</span>
                  <span className="blog-row-sep">&middot;</span>
                  <span className="blog-row-category">{post.category}</span>
                  <span className="blog-row-sep">&middot;</span>
                  <span>{post.comments} comments</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
