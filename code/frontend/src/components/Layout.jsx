// Wraps authenticated pages with the sidebar and a consistent content
// width. Pages that need a narrower reading column can pass `narrow`,
// wider dashboards can pass `wide`.
import Navbar from './Navbar';

export default function Layout({ children, narrow = false, wide = false }) {
  const widthClass = narrow ? ' container--narrow' : wide ? ' container--wide' : '';
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <div className={`container${widthClass}`}>{children}</div>
      </main>
    </div>
  );
}
