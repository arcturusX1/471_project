import { useState, useEffect } from 'react';

interface Location {
  _id: string;
  resourceId: string;
  name: string;
  type: 'lab' | 'desk' | 'room' | 'computer';
  capacity: number;
  location: string;
  tags: string[];
  qrCodeRef?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    name: '',
    type: 'lab' as 'lab' | 'desk' | 'room' | 'computer',
    capacity: 1,
    location: '',
    tags: '',
    qrCodeRef: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations');
      const data = await res.json();
      setLocations(data.data || []);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(s => s.trim()).filter(s => s)
      };

      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('✅ Location created successfully!');
        setShowCreateForm(false);
        resetForm();
        fetchLocations();
      } else {
        alert('❌ Failed to create location');
      }
    } catch (error) {
      console.error("Error creating location:", error);
      alert('❌ Server error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(s => s.trim()).filter(s => s)
      };

      const res = await fetch(`/api/locations/${editingLocation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('✅ Location updated successfully!');
        setEditingLocation(null);
        resetForm();
        fetchLocations();
      } else {
        alert('❌ Failed to update location');
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert('❌ Server error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('✅ Location deleted successfully!');
        fetchLocations();
      } else {
        alert('❌ Failed to delete location');
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      alert('❌ Server error');
    }
  };

  const resetForm = () => {
    setFormData({
      resourceId: '',
      name: '',
      type: 'lab',
      capacity: 1,
      location: '',
      tags: '',
      qrCodeRef: ''
    });
  };

  const startEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      resourceId: location.resourceId,
      name: location.name,
      type: location.type,
      capacity: location.capacity,
      location: location.location,
      tags: location.tags.join(', '),
      qrCodeRef: location.qrCodeRef || ''
    });
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading locations...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Location Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Location
        </button>
      </div>

      {(showCreateForm || editingLocation) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingLocation ? 'Edit Location' : 'Create New Location'}
            </h3>
            <form onSubmit={editingLocation ? handleUpdate : handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Resource ID</label>
                  <input
                    type="text"
                    required
                    value={formData.resourceId}
                    onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., LAB-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Computer Lab A"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="lab">Lab</option>
                    <option value="desk">Desk</option>
                    <option value="room">Room</option>
                    <option value="computer">Computer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="30"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Building A, Floor 2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="programming, design, research"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">QR Code Reference (optional)</label>
                <input
                  type="text"
                  value={formData.qrCodeRef}
                  onChange={(e) => setFormData({...formData, qrCodeRef: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="QR-001"
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingLocation(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLocation ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {locations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No locations found. Add your first location!</p>
          </div>
        ) : (
          locations.map((location) => (
            <div key={location._id} className="bg-white rounded-lg shadow p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{location.name}</h3>
                  <p className="text-sm text-gray-600">ID: {location.resourceId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(location)}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(location._id)}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-medium text-slate-700">Type:</span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm capitalize">
                    {location.type}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Capacity:</span>
                  <span className="ml-2">{location.capacity}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Location:</span>
                  <span className="ml-2">{location.location}</span>
                </div>
                {location.qrCodeRef && (
                  <div>
                    <span className="font-medium text-slate-700">QR Code:</span>
                    <span className="ml-2">{location.qrCodeRef}</span>
                  </div>
                )}
              </div>
              
              {location.tags.length > 0 && (
                <div className="mb-4">
                  <span className="font-medium text-slate-700">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {location.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                Created {new Date(location.createdAt).toLocaleDateString()}
                {location.updatedAt !== location.createdAt && (
                  <span className="ml-2">• Updated {new Date(location.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
