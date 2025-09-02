import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface OrderDetails {
  _id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  statusHistory?: Array<{
    status: string;
    updatedBy: string;
    updatedAt: string;
  }>;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  amount: number;
  paymentMode: string;
  transactionId?: string;
  invoiceUrl?: string;
  project: {
    title: string;
    description: string;
    deliveryDate?: string;
  };
  adminNotes?: string;
}

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [notesEditing, setNotesEditing] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Admin status update handler
  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    setStatusUpdating(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/orders/${order._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder({ ...order, ...updated });
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to update status');
      }
    } catch (e) {
      setError('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const isAdminRoute = window.location.pathname.includes('/admin/orders/');
        const endpoint = isAdminRoute
          ? `http://localhost:5001/api/orders/admin/${orderId}`
          : `http://localhost:5001/api/orders/${orderId}`;
        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Support both {order: ...} and direct order object
          const orderObj = data.order || data;
          setOrder(orderObj);
          setAdminNotes(orderObj.adminNotes || '');
        } else {
          if (isAdminRoute) {
            navigate('/admin/orders');
          } else {
            navigate('/dashboard');
          }
        }
      } catch {
        if (window.location.pathname.includes('/admin/orders/')) {
          navigate('/admin/orders');
        } else {
          navigate('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);
  // Save admin notes handler
  const handleSaveNotes = async () => {
    if (!order) return;
    setNotesSaving(true);
    setNotesError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/orders/${order._id}/admin-notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder({ ...order, ...updated });
        setNotesEditing(false);
      } else {
        const err = await res.json();
        setNotesError(err.error || 'Failed to save notes');
      }
    } catch (e) {
      setNotesError('Failed to save notes');
    } finally {
      setNotesSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!order) return <div className="p-8">Order not found.</div>;

  // Admin action buttons logic
  // Only show for admins (assume admin if token exists and on admin route)
  // You may want to improve this with a real role check
  const isAdmin = window.location.pathname.includes('/admin/orders/');
  // Define allowed next statuses based on current status
  const statusTransitions: Record<string, string[]> = {
    pending: ['paid', 'processing', 'cancelled'], // 'paid' is first for button order
    paid: ['processing', 'cancelled'],
    processing: ['delivered', 'cancelled', 'refunded'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: [],
    completed: [],
  };
  const nextStatuses = statusTransitions[order.status] || [];

  // Status timeline logic

  const statusSteps = [
    { key: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { key: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { key: 'delivered', label: 'Delivered', color: 'bg-purple-100 text-purple-800' },
    { key: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { key: 'refunded', label: 'Refunded', color: 'bg-gray-200 text-gray-800' },
  ];
  // Build a map of status to timestamp from statusHistory
  const statusMap: Record<string, string> = {};
  if (order.statusHistory) {
    order.statusHistory.forEach(h => {
      statusMap[h.status] = h.updatedAt;
    });
  }
  // Add createdAt as pending if not in history
  if (!statusMap['pending']) statusMap['pending'] = order.createdAt;
  // Find the index of the current status in the steps
  const currentStatusIdx = statusSteps.findIndex(s => s.key === order.status);
  const currentStatusObj = statusSteps[currentStatusIdx] || statusSteps[0];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            if (isAdmin) {
              navigate('/admin?tab=orders');
            } else {
              navigate('/dashboard');
            }
          }}
          className="text-blue-600 hover:underline"
        >&larr; Back to Orders</button>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${currentStatusObj.color}`}>{currentStatusObj.label}</span>
      </div>
      <h2 className="text-2xl font-bold mb-6">Order #{order._id.slice(-6)}</h2>


      {/* Admin Action Buttons */}
      {isAdmin && nextStatuses.length > 0 && !['delivered','completed','cancelled','refunded'].includes(order.status) && (
        <div className="mb-6 flex gap-3">
          <span className="font-semibold text-gray-700 mr-2">Admin Actions:</span>
          {nextStatuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              disabled={statusUpdating}
              className={`px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50`}
            >
              Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          {statusUpdating && <span className="ml-2 text-xs text-gray-500">Updating...</span>}
          {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
        </div>
      )}

      {/* Status Timeline */}

      <div className="mb-8">
        <h3 className="font-semibold mb-2">Status Timeline</h3>
        <div className="flex flex-wrap gap-4 items-center">
          {statusSteps.map((step, idx) => {
            const isCurrent = idx === currentStatusIdx;
            let dateStr = '—';
            if (statusMap[step.key]) {
              dateStr = new Date(statusMap[step.key]).toLocaleString();
            } else if (isCurrent && order.updatedAt) {
              dateStr = new Date(order.updatedAt).toLocaleString();
            }
            return (
              <div key={step.key} className="flex flex-col items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCurrent ? step.color + ' ring-2 ring-blue-400' : 'bg-gray-100 text-gray-400'}`}>{step.label}</span>
                <span className="text-xs text-gray-500 mt-1 min-w-[110px] text-center">{dateStr}</span>
                {idx < statusSteps.length - 1 && <span className="h-4 border-l-2 border-gray-300 mx-2"></span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="text-sm text-gray-700">ID: {order._id}</div>
        <div className="text-sm text-gray-700">Date: {new Date(order.createdAt).toLocaleString()}</div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Customer Info</h3>
        <div className="text-sm text-gray-700">{order.user.firstName} {order.user.lastName}</div>
        <div className="text-sm text-gray-700 flex items-center gap-2">
          Email: {order.user.email}
          <a
            href={`mailto:${order.user.email}`}
            className="ml-1 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200"
            title="Email Customer"
          >Email</a>
        </div>
        {order.user.phone && (
          <div className="text-sm text-gray-700 flex items-center gap-2">
            Phone: {order.user.phone}
            <a
              href={`tel:${order.user.phone}`}
              className="ml-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200"
              title="Call Customer"
            >Call</a>
          </div>
        )}
        {order.user.address && <div className="text-sm text-gray-700">Address: {order.user.address}</div>}
      </div>

      {/* Payment Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Payment Info</h3>
        <div className="text-sm text-gray-700">Amount:  ₹{order.amount}</div>
        <div className="text-sm text-gray-700">Mode: UPI</div>
        {order.transactionId && <div className="text-sm text-gray-700">Transaction ID: {order.transactionId}</div>}
        <button
          onClick={async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5001/api/orders/${order._id}/invoice`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
              alert('Failed to download invoice.');
              return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${order._id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          }}
          className="inline-block mt-2 px-3 py-1 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
        >
          Download Invoice
        </button>
      </div>

      {/* Project Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Project Info</h3>
        <div className="text-sm text-gray-700">Title: {order.project.title}</div>
        <div className="text-sm text-gray-700">Description: {order.project.description}</div>
        {order.project.deliveryDate && <div className="text-sm text-gray-700">Delivery Date: {order.project.deliveryDate}</div>}
      </div>


      {/* Admin Notes */}
      <div className="mb-2 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Admin Notes</h3>
        {isAdmin ? (
          <div>
            {notesEditing ? (
              <div>
                <textarea
                  className="w-full border rounded p-2 text-sm min-h-[60px]"
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  disabled={notesSaving}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleSaveNotes}
                    disabled={notesSaving}
                  >Save</button>
                  <button
                    className="px-3 py-1 rounded bg-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-400"
                    onClick={() => { setNotesEditing(false); setAdminNotes(order.adminNotes || ''); }}
                    disabled={notesSaving}
                  >Cancel</button>
                  {notesSaving && <span className="ml-2 text-xs text-gray-500">Saving...</span>}
                  {notesError && <span className="ml-2 text-xs text-red-500">{notesError}</span>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-700 min-h-[40px]">{order.adminNotes || <span className="italic text-gray-400">No notes</span>}</div>
                <button
                  className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200"
                  onClick={() => setNotesEditing(true)}
                >Edit</button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-700 min-h-[40px]">{adminNotes || <span className="italic text-gray-400">No notes</span>}</div>
        )}
      </div>

    </div>
  );
};

export default OrderDetailsPage;
