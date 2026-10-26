"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  category: string;
  palette: string;
  season: string;
  occasion: string;
  color: string;
  image: string;
  tags: string[];
};

const initialItems: Item[] = [
  {
    id: 1,
    name: "Ivory ribbed knit",
    category: "Tops",
    palette: "Neutral",
    season: "Spring",
    occasion: "Work",
    color: "Ivory",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    tags: ["Soft knit", "Long sleeve", "Minimal"]
  },
  {
    id: 2,
    name: "Sand wide-leg trouser",
    category: "Bottoms",
    palette: "Earth",
    season: "Summer",
    occasion: "Casual",
    color: "Sand",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    tags: ["Tailored", "Relaxed", "Lightweight"]
  },
  {
    id: 3,
    name: "Black satin slip",
    category: "Dresses",
    palette: "Monochrome",
    season: "Fall",
    occasion: "Going out",
    color: "Black",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    tags: ["Silk", "Evening", "Polished"]
  },
  {
    id: 4,
    name: "Camel trench",
    category: "Outerwear",
    palette: "Warm tones",
    season: "Fall",
    occasion: "Work",
    color: "Camel",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    tags: ["Layering", "Structured", "Classic"]
  },
  {
    id: 5,
    name: "Cream leather tote",
    category: "Accessories",
    palette: "Neutral",
    season: "All-season",
    occasion: "Casual",
    color: "Cream",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    tags: ["Everyday", "Minimal", "Statement"]
  },
  {
    id: 6,
    name: "Chocolate loafers",
    category: "Shoes",
    palette: "Deep tones",
    season: "Fall",
    occasion: "Work",
    color: "Brown",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
    tags: ["Refined", "Leather", "City-ready"]
  }
];

const navItems = ["Closet", "Search", "Inspiration", "Profile"];
const filterChips = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];

export default function Home() {
  const [items, setItems] = useState(initialItems);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("Closet");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState("Tops");

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const outfitIdeas = useMemo(
    () => [
      { title: "City day polish", pieces: ["Ivory ribbed knit", "Sand wide-leg trouser", "Chocolate loafers"] },
      { title: "Evening minimal", pieces: ["Black satin slip", "Camel trench", "Cream leather tote"] },
      { title: "Soft work edit", pieces: ["Ivory ribbed knit", "Camel trench", "Brown loafers"] }
    ],
    []
  );

  const handleSubmit = () => {
    if (!draftName.trim()) return;

    const newItem: Item = {
      id: Date.now(),
      name: draftName,
      category: draftCategory,
      palette: "New",
      season: "All-season",
      occasion: "Casual",
      color: "Cream",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      tags: ["New arrival", "Editor pick"]
    };

    setItems((current) => [newItem, ...current]);
    setDraftName("");
    setDraftCategory("Tops");
    setComposerOpen(false);
  };

  return (
    <main className="page-shell">
      <div className="app-frame">
        <header className="topbar">
          <div>
            <p className="eyebrow">Wardrobe</p>
            <h2>What to Wear</h2>
          </div>
          <button className="icon-button" aria-label="Notifications">
            •
          </button>
        </header>

        <section className="hero-card">
          <div className="hero-copy">
            <p className="overline">Curated closet</p>
            <h1>Style your day with less effort.</h1>
          </div>
          <div className="cta-row">
            <button className="primary-button" onClick={() => setComposerOpen(true)}>
              Add item
            </button>
            <button className="secondary-button">Search look</button>
          </div>
        </section>

        <section className="stats-row">
          <div className="stat-card">
            <span>Pieces</span>
            <strong>{items.length}</strong>
          </div>
          <div className="stat-card">
            <span>Looks</span>
            <strong>24</strong>
          </div>
          <div className="stat-card">
            <span>Saved</span>
            <strong>12</strong>
          </div>
        </section>

        <nav className="tab-bar" aria-label="Main navigation">
          {navItems.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className="search-card">
          <div className="search-line">
            <span className="search-icon">⌕</span>
            <input defaultValue="Find me a work outfit, short sleeve, long pants" />
          </div>
          <div className="filter-row">
            {filterChips.map((chip) => (
              <button
                key={chip}
                className={activeCategory === chip ? "chip active" : "chip"}
                onClick={() => setActiveCategory(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        <section className="section-header">
          <div>
            <p className="eyebrow">Your closet</p>
            <h3>Recently added</h3>
          </div>
          <button className="text-button">View all</button>
        </section>

        <section className="item-grid">
          {filteredItems.map((item) => (
            <article key={item.id} className="item-card">
              <div className="image-wrap">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-copy">
                <div className="name-line">
                  <h4>{item.name}</h4>
                  <span>{item.color}</span>
                </div>
                <p>{item.category}</p>
                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <span key={tag} className="mini-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="suggestion-panel">
          <div className="section-header compact">
            <div>
              <p className="eyebrow">Recommended</p>
              <h3>Outfit moods</h3>
            </div>
          </div>

          <div className="suggestion-list">
            {outfitIdeas.map((look) => (
              <div key={look.title} className="look-card">
                <div className="look-label">{look.title}</div>
                <div className="look-pieces">
                  {look.pieces.map((piece) => (
                    <span key={piece}>{piece}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {composerOpen && (
        <div className="modal-backdrop" onClick={() => setComposerOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">New item</p>
                <h3>Add to closet</h3>
              </div>
              <button className="close-button" onClick={() => setComposerOpen(false)}>
                ×
              </button>
            </div>

            <div className="upload-panel">
              <button className="upload-action">Camera</button>
              <button className="upload-action">Library</button>
              <button className="upload-action">Link</button>
            </div>

            <label className="field-label">
              Item name
              <input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Ivory knit set" />
            </label>

            <label className="field-label">
              Category
              <select value={draftCategory} onChange={(e) => setDraftCategory(e.target.value)}>
                {filterChips.filter((c) => c !== "All").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setComposerOpen(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={handleSubmit}>
                Save item
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
