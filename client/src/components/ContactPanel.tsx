import React from 'react';

export default function ContactPanel() {
  return (
    <div className="floating-panel bg-card rounded-lg p-6 shadow-lg w-96">
      <h3 className="font-serif text-xl font-semibold mb-2">Contact & Partnerships</h3>
      <p className="mb-4">Interested in investing or collaborating? Reach out to us for partnership opportunities, investor inquiries, or more information about the Sulphur Mountain Eco-Village project.</p>
      <form className="flex flex-col gap-3">
        <input type="text" placeholder="Your Name" className="input input-bordered" required />
        <input type="email" placeholder="Your Email" className="input input-bordered" required />
        <textarea placeholder="Message" className="input input-bordered" rows={4} required />
        <button type="submit" className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-semibold mt-2 hover:bg-primary/90">Send Inquiry</button>
      </form>
    </div>
  );
}
