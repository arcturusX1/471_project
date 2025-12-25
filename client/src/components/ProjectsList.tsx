import { Search, Filter, Plus, UserPlus } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { UserRole, Project, Evaluation } from '../App';
import { AddProjectModal } from './AddProjectModal';

interface ProjectsListProps {
  userRole: UserRole;
  onViewProject: (projectId: string) => void;
  onAddProject: (project: Project) => void;
  projects: Project[];
  evaluations: Evaluation[];
  onProjectCreated?: () => Promise<void> | void;
  studentName: string;
}

export function ProjectsList({ userRole, onViewProject, onAddProject, projects, evaluations, onProjectCreated, studentName }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = useMemo(() => {
    const depts = new Set(projects.map((p) => p.department));
    return Array.from(depts);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesDept = departmentFilter === 'all' || project.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [projects, searchTerm, statusFilter, departmentFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Academic Projects</h2>
          <p className="text-gray-600 mt-1">
            {userRole === 'faculty' 
              ? 'View all projects and assign yourself to evaluate' 
              : 'Manage and evaluate student projects'}
          </p>
        </div>
        {userRole === 'student' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white border-none"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const projectEvals = evaluations.filter((e) => e.projectId === project.id);
          const submittedEvals = projectEvals.filter((e) => e.status === 'Submitted');
          const avgScore =
            submittedEvals.length > 0
              ? submittedEvals.reduce((sum, e) => sum + e.totalScore, 0) / submittedEvals.length
              : null;

          return (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => onViewProject(project.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  <span
                    className={`ml-3 px-3 py-1 rounded-full text-xs flex-shrink-0 ${
                      project.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : project.status === 'Review'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Student</p>
                    <p className="text-sm text-gray-900 mt-1">{project.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Department</p>
                    <p className="text-sm text-gray-900 mt-1">{project.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Supervisor</p>
                    <p className="text-sm text-gray-900 mt-1">{project.supervisor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Timeline</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">
                      Evaluations: {submittedEvals.length}/{projectEvals.length}
                    </div>
                  </div>
                  {avgScore !== null ? (
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Average Score</p>
                      <p className="text-gray-900">{avgScore.toFixed(1)}/100</p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Pending evaluation</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No projects found matching your filters</p>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onSuccess={async () => {
            if (onProjectCreated) {
              await onProjectCreated();
            }
          }}
          studentName={studentName}
        />
      )}
    </div>
  );
}
