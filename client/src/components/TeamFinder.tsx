import { useState, useEffect } from 'react';

interface GroupPost {
  _id: string;
  title: string;
  description: string;
  goal: string;
  neededSkills: string[];
  stack: string[];
  preferredRole: string;
  maxMembers: number;
  members: any[];
  isOpen: boolean;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function TeamFinder() {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    neededSkills: '',
    stack: '',
    preferredRole: 'any',
    maxMembers: 4
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/group-posts');
      const data = await res.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch group posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/group-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          neededSkills: formData.neededSkills.split(',').map(s => s.trim()),
          stack: formData.stack.split(',').map(s => s.trim())
        })
      });
      
      if (res.ok) {
        alert('✅ Team post created successfully!');
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          goal: '',
          neededSkills: '',
          stack: '',
          preferredRole: 'any',
          maxMembers: 4
        });
        fetchPosts();
      } else {
        alert('❌ Failed to create post');
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert('❌ Server error');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading team posts...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Team Finder</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Team Post
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create Team Post</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter project title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  placeholder="Describe your project"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Goal</label>
                <input
                  type="text"
                  required
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="What do you want to achieve?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Needed Skills (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.neededSkills}
                    onChange={(e) => setFormData({...formData, neededSkills: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.stack}
                    onChange={(e) => setFormData({...formData, stack: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="React, Express, MongoDB"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Role</label>
                  <select
                    value={formData.preferredRole}
                    onChange={(e) => setFormData({...formData, preferredRole: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="any">Any</option>
                    <option value="leader">Leader</option>
                    <option value="member">Member</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Max Members</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    required
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No team posts found. Create the first one!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{post.title}</h3>
                  <p className="text-sm text-gray-600">by {post.author.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {post.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">{post.description}</p>
              
              <div className="mb-4">
                <h4 className="font-medium text-slate-700 mb-2">Goal:</h4>
                <p className="text-gray-600 text-sm">{post.goal}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Needed Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {post.neededSkills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-1">
                    {post.stack.map((tech, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span className="font-medium">Role:</span> {post.preferredRole} | 
                  <span className="font-medium ml-2">Members:</span> {post.members.length}/{post.maxMembers}
                </div>
                <div>
                  Created {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
