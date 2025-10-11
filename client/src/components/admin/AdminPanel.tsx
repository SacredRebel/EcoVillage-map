import React, { useState } from 'react';

export default function AdminPanel() {
  // Placeholder for admin features: edit project, upload images, track progress, revenue input
  const [tab, setTab] = useState('projects');
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="flex gap-4 mb-6">
        <button className={`px-4 py-2 rounded ${tab==='projects'?'bg-primary text-primary-foreground':'bg-muted text-muted-foreground'}`} onClick={()=>setTab('projects')}>Projects</button>
        <button className={`px-4 py-2 rounded ${tab==='images'?'bg-primary text-primary-foreground':'bg-muted text-muted-foreground'}`} onClick={()=>setTab('images')}>Images</button>
        <button className={`px-4 py-2 rounded ${tab==='progress'?'bg-primary text-primary-foreground':'bg-muted text-muted-foreground'}`} onClick={()=>setTab('progress')}>Progress</button>
        <button className={`px-4 py-2 rounded ${tab==='revenue'?'bg-primary text-primary-foreground':'bg-muted text-muted-foreground'}`} onClick={()=>setTab('revenue')}>Revenue</button>
      </div>
      <div>
        {tab === 'projects' && <div>Edit project details (form coming soon)</div>}
        {tab === 'images' && <div>Upload/manage images (coming soon)</div>}
        {tab === 'progress' && <div>Track project progress (coming soon)</div>}
        {tab === 'revenue' && <div>Input/visualize revenue (coming soon)</div>}
      </div>
    </div>
  );
}
