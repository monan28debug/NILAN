import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCollection } from '../utils/useCollection';

export default function Contact({ onRequireLogin }) {
  const { data } = useCollection('settings');
  const contact = data.find((d) => d.id === 'contact') || {};

  return (
    <div>
      <Header onRequireLogin={onRequireLogin} />
      <div className="max-w-lg mx-auto px-4 md:px-8 py-10">
        <h1 className="section-title mb-8">Contact</h1>
        <div className="space-y-5 text-sm">
          <div>
            <p className="text-charcoal/50 mb-1">Email</p>
            <p>{contact.email || 'Not configured yet'}</p>
          </div>
          <div>
            <p className="text-charcoal/50 mb-1">Messenger</p>
            <p>{contact.messenger || 'Not configured yet'}</p>
          </div>
          <div>
            <p className="text-charcoal/50 mb-1">Phone</p>
            <p>{contact.phone || 'Not configured yet'}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
