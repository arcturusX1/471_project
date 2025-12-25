import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { projectApi, type CreateProjectData } from '../services/projectService';
import { toast } from 'sonner';

interface AddProjectModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
  studentName: string;
}

export function AddProjectModal({ onClose, onSuccess, studentName }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    studentId: '',
    description: '',
    department: 'Computer Science',
    supervisor: '',
    startDate: '',
    endDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.studentId || !formData.description || !formData.supervisor || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const projectData: CreateProjectData = {
        studentId: formData.studentId,
        title: formData.title,
        description: formData.description,
        department: formData.department,
        supervisorName: formData.supervisor,
        startDate: formData.startDate,
        expectedEndDate: formData.endDate,
      };

      await projectApi.createProject(projectData);
      toast.success('Project submitted successfully!');
      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating project:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
        return;
      }
      toast.error(error.response?.data?.message || 'Failed to submit project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-gray-900">Add New Project</h3>
            <p className="text-sm text-gray-600 mt-1">Submit your academic project for evaluation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Student Name (Read-only) */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                disabled
                placeholder="Loading..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CS2021-1234"
                required
              />
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your project title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe your project objectives, methodology, and expected outcomes..."
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Psychology">Psychology</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>

            {/* Supervisor */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Supervisor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dr. Sarah Johnson"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Expected End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
