import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCollection } from '../utils/useCollection';

export default function FAQ({ onRequireLogin }) {
  const { data: faqs } = useCollection('faqs');
  const [open, setOpen] = useState(null);

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Help / FAQ</h1>
        {faqs.length === 0 ? (
          <p className="text-charcoal/50 text-sm">No FAQs added yet.</p>
        ) : (
          <div className="divide-y divide-line/10 border-t border-b border-line/10">
            {faqs.map((f, i) => (
              <div key={f.id}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left py-4 flex justify-between items-center"
                >
                  <span className="text-sm font-medium">{f.question}</span>
                  <span className="text-gold">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p className="pb-4 text-sm text-charcoal/60">{f.answer}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
