import { useMemo, useState } from 'react';
import { Archive, Bell, Check, ChevronDown, Clock3, FileText, Folder, HardDrive, Image, LayoutDashboard, LockKeyhole, Menu, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Star, Trash2, X, Sparkles, ArrowUpRight } from 'lucide-react';

const seed = [
  { id: 1, name: 'Personal documents', type: 'folder', detail: '8 items', updated: 'Updated today', color: 'purple', starred: true },
  { id: 2, name: 'School notes — Term 3.pdf', type: 'pdf', detail: '2.4 MB', updated: 'Yesterday', color: 'orange', starred: true },
  { id: 3, name: 'Family photos', type: 'image', detail: '24 images', updated: 'Oct 10, 2026', color: 'pink', starred: false },
  { id: 4, name: 'Project ideas.docx', type: 'doc', detail: '840 KB', updated: 'Oct 9, 2026', color: 'blue', starred: false },
  { id: 5, name: 'Certificates', type: 'folder', detail: '3 items', updated: 'Oct 7, 2026', color: 'green', starred: false },
  { id: 6, name: 'Budget planner.pdf', type: 'pdf', detail: '1.1 MB', updated: 'Oct 5, 2026', color: 'orange', starred: false },
];
const navigation = [{ label: 'Overview', icon: LayoutDashboard }, { label: 'My locker', icon: LockKeyhole }, { label: 'Starred', icon: Star }, { label: 'Recent', icon: Clock3 }, { label: 'Trash', icon: Trash2 }];

export default function App() {
  const [items, setItems] = useState(seed);
  const [active, setActive] = useState('Overview');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('folder');
  const [notice, setNotice] = useState('');
  const [menu, setMenu] = useState(false);
  const filtered = useMemo(() => {
    let result = [...items];
    if (active === 'Starred') result = result.filter(x => x.starred);
    if (active === 'Recent') result = result.filter(x => x.updated.includes('today') || x.updated.includes('Yesterday'));
    if (active === 'Trash') result = [];
    if (query.trim()) result = result.filter(x => x.name.toLowerCase().includes(query.toLowerCase()));
    return result;
  }, [items, active, query]);
  const toast = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2800); };
  const addItem = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setItems(old => [{ id: Date.now(), name: name.trim(), type, detail: type === 'folder' ? 'Empty folder' : 'New item', updated: 'Added just now', color: type === 'folder' ? 'purple' : 'blue', starred: false }, ...old]);
    setName(''); setType('folder'); setModal(false); setActive('My locker'); toast('Added to your locker');
  };
  const iconFor = (item) => item.type === 'folder' ? Folder : item.type === 'image' ? Image : FileText;
  return <div className="app-shell">
    <aside className={'sidebar ' + (menu ? 'sidebar-open' : '')}>
      <a className="brand" href="#" onClick={e => { e.preventDefault(); setActive('Overview'); }}><span className="brand-mark"><LockKeyhole size={21}/></span><span>LOCKER<span className="brand-period">.</span><small>YOUR SPACE, SECURED</small></span></a>
      <button className="workspace-switch"><span className="workspace-avatar">L</span><span className="workspace-copy"><strong>Personal space</strong><small>Free workspace</small></span><ChevronDown size={16}/></button>
      <div className="nav-label">WORKSPACE</div>
      <nav className="main-nav">{navigation.map(({label, icon: Icon}) => <button key={label} className={'nav-item ' + (active === label ? 'active' : '')} onClick={() => { setActive(label); setMenu(false); }}><Icon size={18}/><span>{label}</span>{label === 'My locker' && <span className="nav-count">{items.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="storage-card"><div className="storage-icon"><HardDrive size={17}/></div><div className="storage-head"><strong>Storage overview</strong><span>32%</span></div><div className="storage-track"><span/></div><p>3.2 GB <span>of 10 GB used</span></p><button onClick={() => toast('Cloud storage will be connected in a later build.')}>Manage storage <ArrowUpRight size={14}/></button></div>
        <button className="nav-item" onClick={() => toast('Help center is coming soon.')}><ShieldCheck size={18}/><span>Help center</span></button>
        <button className="nav-item" onClick={() => toast('Settings are planned for the next build.')}><Settings2 size={18}/><span>Settings</span></button>
        <div className="profile"><div className="profile-avatar">P</div><div className="profile-copy"><strong>Your account</strong><small>Personal workspace</small></div><MoreHorizontal size={19}/></div>
      </div>
    </aside>
    {menu && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenu(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMenu(true)}><Menu size={21}/></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{active}</strong></div><div className="topbar-actions"><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your locker..."/><kbd>⌘ K</kbd></label><button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast('You are all caught up!')}><Bell size={19}/><i/></button><div className="top-avatar">P</div></div></header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR PERSONAL SPACE</div><h1>{active === 'Overview' ? 'Everything in its place.' : active}</h1><p className="page-subtitle">Your files, notes, and important things. All together.</p></div><button className="primary-button" onClick={() => setModal(true)}><Plus size={18}/> Add to locker</button></section>
        <section className="hero-card"><div className="hero-glow hero-glow-one"/><div className="hero-glow hero-glow-two"/><div className="hero-content"><span className="hero-pill"><Sparkles size={13}/> YOUR SPACE, YOUR RULES</span><h2>A little more peace<br/>of <span>mind.</span></h2><p>Keep the important stuff close, organized, and easy to find. Your digital life starts here.</p><button className="hero-button" onClick={() => { setActive('My locker'); toast('Welcome to your locker.'); }}>Explore my locker <ArrowUpRight size={16}/></button></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="vault-ring"><div className="vault-core"><LockKeyhole size={44}/></div></div><div className="float-chip chip-top"><ShieldCheck size={15}/>Private space</div><div className="float-chip chip-bottom"><Check size={15}/>All organized</div><div className="sparkle sparkle-one">✦</div><div className="sparkle sparkle-two">✧</div></div><div className="hero-index">01 <span>/</span> 03</div></section>
        <section className="stats-grid"><Stat icon={Folder} label="Total items" value={String(items.length).padStart(2,'0')} foot="Across your locker" tone="violet"/><Stat icon={Star} label="Starred items" value={String(items.filter(x => x.starred).length).padStart(2,'0')} foot="Your quick access" tone="amber"/><Stat icon={HardDrive} label="Storage used" value="3.2 GB" foot="32% of your space" tone="blue"/><Stat icon={ShieldCheck} label="Security status" value="Demo only" foot="Protection not connected" tone="green"/></section>
        <section className="items-section"><div className="section-heading"><div><h3>{active === 'Overview' ? 'Your locker' : active === 'Trash' ? 'Recently removed' : active === 'Starred' ? 'Your starred items' : active === 'Recent' ? 'Recently opened' : 'All items'}</h3><p>Pick up right where you left off.</p></div><div className="section-actions"><button className="filter-button" onClick={() => setActive('My locker')}><span>All items</span><ChevronDown size={14}/></button><button className="view-all" onClick={() => setActive('My locker')}>View all <ArrowUpRight size={15}/></button></div></div>
        {filtered.length ? <div className="items-grid">{filtered.map(item => { const Icon = iconFor(item); return <article className="item-card" key={item.id}><div className="item-card-top"><div className={'file-icon ' + item.color}><Icon size={23}/></div><button className={'star-button ' + (item.starred ? 'is-starred' : '')} aria-label="Toggle star" onClick={() => setItems(old => old.map(x => x.id === item.id ? {...x, starred: !x.starred} : x))}><Star size={16} fill={item.starred ? 'currentColor' : 'none'}/></button></div><button className="item-name" onClick={() => toast('Sample item only. File storage will be connected in a later build.')}>{item.name}</button><div className="item-meta">{item.detail}</div><div className="item-card-bottom"><span><Clock3 size={13}/> {item.updated}</span><button className="item-more" aria-label="Remove item" onClick={() => { setItems(old => old.filter(x => x.id !== item.id)); toast('Item removed from this demo view.'); }}><MoreHorizontal size={18}/></button></div></article>; })}<button className="add-card" onClick={() => setModal(true)}><span className="add-card-icon"><Plus size={21}/></span><strong>Add something new</strong><small>Make room for what matters.</small></button></div> : <div className="empty-state"><Archive size={27}/><strong>{active === 'Trash' ? 'Nothing in the trash' : 'Nothing found just yet'}</strong><span>Try another search or add something to your locker.</span><button onClick={() => { setQuery(''); setActive('My locker'); setModal(true); }}>Add an item</button></div>}</section>
        <footer className="footer"><span>© 2026 LOCKER</span><span><i/> Made for a calmer digital life</span><span>Built with care <span className="footer-heart">♥</span></span></footer>
      </div>
    </main>
    {modal && <div className="modal-backdrop" onClick={() => setModal(false)}><form className="add-modal" onSubmit={addItem} onClick={e => e.stopPropagation()}><button type="button" className="modal-close" aria-label="Close" onClick={() => setModal(false)}><X size={18}/></button><div className="modal-symbol"><Plus size={22}/></div><h2>Add to your locker</h2><p>Create a folder or add a placeholder item to organize your space.</p><label className="field-label" htmlFor="item-name">Name</label><input id="item-name" className="modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Travel documents" autoFocus required/><label className="field-label" htmlFor="item-kind">Item type</label><select id="item-kind" className="modal-input" value={type} onChange={e => setType(e.target.value)}><option value="folder">Folder</option><option value="pdf">PDF document</option><option value="doc">Document</option><option value="image">Image</option></select><div className="modal-note"><ShieldCheck size={16}/><span>This is a UI prototype. It does not upload or securely store files yet.</span></div><button className="primary-button modal-submit" type="submit"><Plus size={17}/> Create item</button></form></div>}
    {notice && <div className="toast"><Check size={17}/>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
  </div>;
}
function Stat({icon: Icon, label, value, foot, tone}) { return <div className="stat-card"><div className={'stat-icon ' + tone}><Icon size={18}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot">{foot}</div></div>; }
