import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';

export default function AdminFAQ() {
  const { data, add, update, remove } = useCollection('faqs', 'createdAt');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!question || !answer) return;
    await add({ question, answer });
    setQuestion(''); setAnswer('');
  };

  return (
    <AdminLayout title="Help / FAQ">
      <form onSubmit={submit} className="bg-ivory border border-line/10 p-5 space-y-3 max-w-md mb-8">
        <input required placeholder="Question" className="input-field" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <textarea required placeholder="Answer" className="input-field" rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button className="btn-gold">Add FAQ</button>
      </form>
      <div className="space-y-3">
        {data.map((f) => (
          <div key={f.id} className="bg-ivory border border-line/10 p-4 flex justify-between items-start gap-4">
            <div>
              <p className="text-sm font-medium">{f.question}</p>
              <p className="text-sm text-charcoal/60">{f.answer}</p>
            </div>
            <button onClick={() => remove(f.id)} className="text-xs text-rust underline whitespace-nowrap">Delete</button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
