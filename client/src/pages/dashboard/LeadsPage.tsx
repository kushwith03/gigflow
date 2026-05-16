import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { leadService, LeadFilters } from '@/services/lead.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { LeadModal } from '@/components/leads/LeadModal';

const LeadsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // State
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  // Filters state
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    source: '',
    sort: 'latest',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      setLeads(response.data);
      setPagination(response.meta);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete lead');
    }
  };

  const openEditModal = (lead: any) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'info';
      case 'Contacted': return 'warning';
      case 'Qualified': return 'success';
      case 'Lost': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your sales leads</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={18} className="mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white min-w-[120px]"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white min-w-[120px]"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Spinner size="lg" />
            <p className="text-gray-500 animate-pulse">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={filters.search || filters.status || filters.source ? "Try adjusting your filters to find what you're looking for." : "Start by adding your first lead to the system."}
            action={!filters.search && !filters.status && !filters.source && (
              <Button onClick={openCreateModal}>Add Lead</Button>
            )}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && leads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> leads
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={cn(
                      "w-8 h-8 rounded-md text-sm font-medium transition-colors",
                      pagination.page === p 
                        ? "bg-primary-600 text-white" 
                        : "text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
        lead={selectedLead}
      />
    </div>
  );
};

export default LeadsPage;
