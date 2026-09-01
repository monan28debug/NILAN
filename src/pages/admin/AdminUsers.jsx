import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';
import { formatDateTime } from '../../utils/format';

export default function AdminUsers() {
  const { data: users } = useCollection('users');
  const { data: logins } = useCollection('loginHistory', 'loggedInAt');

  return (
    <AdminLayout title="Users / Login History">
      <h3 className="font-display text-lg mb-3">Registered users</h3>
      <div className="overflow-x-auto bg-ivory border border-line/10 mb-10">
        <table className="w-full text-sm">
          <thead className="bg-parchment text-left">
            <tr>{['Name', 'Gender', 'Phone 1', 'Phone 2', 'Address', 'Landmark', 'Email', 'Firebase UID'].map((h) => (
              <th key={h} className="px-4 py-3 font-medium text-charcoal/60 whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-line/10">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.gender}</td>
                <td className="px-4 py-3">{u.phone1}</td>
                <td className="px-4 py-3">{u.phone2}</td>
                <td className="px-4 py-3">{u.address}</td>
                <td className="px-4 py-3">{u.landmark}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 text-xs text-charcoal/40">{u.uid}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-6 text-charcoal/40 text-sm">No users yet.</p>}
      </div>

      <h3 className="font-display text-lg mb-3">Recent logins</h3>
      <div className="space-y-2">
        {logins.slice(0, 30).map((l) => (
          <div key={l.id} className="flex justify-between text-sm border-b border-line/10 pb-2">
            <span>{l.email}</span>
            <span className="text-xs text-charcoal/50">{formatDateTime(l.loggedInAt)}</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
