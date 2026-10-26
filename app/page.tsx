"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Item = {
  id: number;
  name: string;
  category: "Tops" | "Bottoms" | "Dresses" | "Outerwear" | "Shoes" | "Accessories";
  palette: string;
  season: string;
  occasion: string;
  color: string;
  image: string;
  tags: string[];
  source: string;
  createdAt: string;
};

const STORAGE_KEY = "what-to-wear-items-v1";

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
    tags: ["Soft knit", "Long sleeve", "Minimal"],
    source: "library",
    createdAt: "2026-10-01T09:00:00.000Z"
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
    tags: ["Tailored", "Relaxed", "Lightweight"],
    source: "library",
    createdAt: "2026-10-02T12:00:00.000Z"
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
    tags: ["Silk", "Evening", "Polished"],
    source: "library",
    createdAt: "2026-10-03T18:00:00.000Z"
  }
];

const navItems = ["Closet", "Search", "Inspiration", "Profile"] as const;
const filterChips = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"] as const;
const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"] as const;

type Category = (typeof categories)[number];

function generateAutoTags(category: Category, name: string) {
  const baseMap: Record<Category, string[]> = {
    Tops: ["Soft structure", "Everyday", "Layering"],
    Bottoms: ["Tailored", "Relaxed", "Straight fit"],
    Dresses: ["Polished", "Easy drape", "Day to night"],
    Outerwear: ["Classic", "Layering", "Statement"],
    Shoes: ["Daily wear", "Smart", "Comfort first"],
    Accessories: ["Minimal", "Everyday", "Editor pick"]
  };

  const normalizedName = name.toLowerCase();
  const tags = [...baseMap[category]];

  if (normalizedName.includes("black")) tags.unshift("Black");
  if (normalizedName.includes("cream") || normalizedName.includes("ivory")) tags.unshift("Warm neutral");
  if (normalizedName.includes("satin")) tags.unshift("Satin");
  if (normalizedName.includes("trench")) tags.unshift("Trench");

  return Array.from(new Set(tags)).slice(0, 4);
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState<(typeof filterChips)[number]>("All");
  const [activeTab, setActiveTab] = useState<(typeof navItems)[number]>("Closet");
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category>("Tops");
  const [draftTags, setDraftTags] = useState<string[]>(["Minimal", "Everyday"]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [draftSource, setDraftSource] = useState("camera");
  const [tagDraft, setTagDraft] = useState("");

  useEffect(() => {
    const parsed = window.localStorage.getItem(STORAGE_KEY);
    if (parsed) {
      try {
        const saved = JSON.parse(parsed) as Item[];
        if (Array.isArray(saved) && saved.length > 0) {
          setItems(saved);
        }
      } catch {
        // Ignore invalid local storage values.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const outfitIdeas = useMemo(
    () => [
      {
        title: "City day polish",
        pieces: ["Ivory ribbed knit", "Sand wide-leg trouser", "Chocolate loafers"]
      },
      {
        title: "Evening minimal",
        pieces: ["Black satin slip", "Camel trench", "Cream leather tote"]
      },
      {
        title: "Soft work edit",
        pieces: ["Ivory ribbed knit", "Camel trench", "Brown loafers"]
      }
    ],
    []
  );

  const openComposer = () => {
    setDraftName("");
    setDraftCategory("Tops");
    setDraftTags(["Minimal", "Everyday"]);
    setSelectedImage("");
    setDraftSource("camera");
    setComposerOpen(true);
  };

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setSelectedImage(result);
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      if (!draftName.trim()) {
        setDraftName(fileName || "New item");
      }
      const generated = generateAutoTags(draftCategory, fileName || draftName || "New item");
      setDraftTags(generated);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const saveDraftItem = () => {
    if (!draftName.trim()) return;

    const nextItem: Item = {
      id: Date.now(),
      name: draftName.trim(),
      category: draftCategory,
      palette: "Editorial",
      season: "All-season",
      occasion: "Casual",
      color: draftCategory === "Bottoms" ? "Sand" : draftCategory === "Dresses" ? "Black" : "Ivory",
      image: selectedImage || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      tags: draftTags.length ? draftTags : generateAutoTags(draftCategory, draftName),
      source: draftSource,
      createdAt: new Date().toISOString()
    };

    setItems((current) => [nextItem, ...current]);
    setComposerOpen(false);
    setSelectedItem(nextItem);
    setDraftName("");
    setDraftCategory("Tops");
    setDraftTags(["Minimal", "Everyday"]);
    setSelectedImage("");
  };

  const updateSelectedItemTags = (nextTags: string[]) => {
    if (!selectedItem) return;
    setItems((current) =>
      current.map((item) => (item.id === selectedItem.id ? { ...item, tags: nextTags } : item))
    );
    setSelectedItem((current) => (current ? { ...current, tags: nextTags } : null));
  };

  const removeTag = (tagToRemove: string) => {
    if (!selectedItem) return;
    const nextTags = selectedItem.tags.filter((tag) => tag !== tagToRemove);
    updateSelectedItemTags(nextTags);
  };

  const addTag = () => {
    if (!selectedItem || !tagDraft.trim()) return;
    const clean = tagDraft.trim();
    if (selectedItem.tags.includes(clean)) {
      setTagDraft("");
      return;
    }

    const nextTags = [...selectedItem.tags, clean];
    updateSelectedItemTags(nextTags);
    setTagDraft("");
  };

  const deleteItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
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
            <button className="primary-button" onClick={openComposer}>
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
            <article key={item.id} className="item-card" onClick={() => setSelectedItem(item)}>
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
                  {item.tags.slice(0, 2).map((tag) => (
                    <span key={`${item.id}-${tag}`} className="mini-tag">
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
              <button className="upload-action" onClick={() => fileInputRef.current?.click()}>
                Camera
              </button>
              <button className="upload-action" onClick={() => fileInputRef.current?.click()}>
                Library
              </button>
              <button className="upload-action" onClick={() => setDraftSource("link")}>Link</button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImagePick}
              hidden
            />

            {selectedImage && (
              <div className="image-preview-shell">
                <img src={selectedImage} alt="Selected clothing piece" className="image-preview" />
              </div>
            )}

            <label className="field-label">
              Item name
              <input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Ivory knit set" />
            </label>

            <label className="field-label">
              Category
              <select value={draftCategory} onChange={(e) => setDraftCategory(e.target.value as Category)}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="field-label">
              AI tags
              <div className="tag-editor-row">
                {draftTags.map((tag) => (
                  <button
                    key={tag}
                    className="mini-tag action-tag"
                    onClick={() => setDraftTags((current) => current.filter((entry) => entry !== tag))}
                    type="button"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setComposerOpen(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={saveDraftItem}>
                Save item
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <aside className="detail-panel">
          <div className="detail-top">
            <div>
              <p className="eyebrow">Selected</p>
              <h3>{selectedItem.name}</h3>
            </div>
            <button className="close-button" onClick={() => setSelectedItem(null)}>
              ×
            </button>
          </div>

          <img src={selectedItem.image} alt={selectedItem.name} className="detail-image" />

          <div className="detail-meta">
            <span>{selectedItem.category}</span>
            <span>{selectedItem.season}</span>
            <span>{selectedItem.occasion}</span>
          </div>

          <div className="detail-tags">
            {selectedItem.tags.map((tag) => (
              <button key={`${selectedItem.id}-${tag}`} className="mini-tag action-tag" onClick={() => removeTag(tag)} type="button">
                {tag} ×
              </button>
            ))}
          </div>

          <div className="tag-add-row">
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              placeholder="Add tag"
            />
            <button className="primary-button small" onClick={addTag} type="button">
              Add
            </button>
          </div>

          <div className="detail-actions">
            <button className="secondary-button" onClick={() => deleteItem(selectedItem.id)}>
              Delete
            </button>
            <button className="primary-button" onClick={() => setSelectedItem(null)}>
              Done
            </button>
          </div>
        </aside>
      )}
    </main>
  );
}
