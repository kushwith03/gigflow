import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Trash2, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import { leadService } from '@/services/lead.service';
import type { Lead, Pagination } from '@/types/lead';
import { useAuthStore } from '@/store/useAuthStore';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { LeadModal } from '@/components/leads/LeadModal';
import { downloadCSV } from '@/utils/csv';
import { cn } from '@/utils/cn';

const LeadsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // Filters & Pagination state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    sort: 'latest',
    limit: 10,
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
        page: currentPage,
      });
      
      // Ensure we don't overwrite leads with empty data if there was a race condition
      // though backend should be consistent.
      setLeads(response.data);
      setPagination(response.meta);
      
      // If current page exceeds total pages after filter/search, reset to last page
      if (response.meta.totalPages > 0 && currentPage > response.meta.totalPages) {
        setCurrentPage(response.meta.totalPages);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch leads';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, currentPage]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    // Boundary checks
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
        limit: 1000,
        page: 1,
      });
      const exportData = response.data.map(lead => ({
        ...lead,
        _id: lead._id.toString(),
      })) as unknown as Record<string, unknown>[];
      
      downloadCSV(exportData, `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Leads exported successfully');
    } catch (error: unknown) {
      toast.error('Failed to export leads');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete lead';
      toast.error(message);
    }
  };

  const openEditModal = (lead: Lead) => {
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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Leads Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
            Monitor, track and organize your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleExport} 
            isLoading={exporting}
            className="hidden sm:flex dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </Button>
          <Button onClick={openCreateModal} className="shadow-lg shadow-primary-500/20">
            <Plus size={18} className="mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all">
        <div className="lg:col-span-5 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input
            name="search"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 border-none focus:ring-0 text-sm bg-transparent dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        
        <div className="lg:col-span-7 flex flex-wrap lg:justify-end gap-3 px-2 py-2 lg:py-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-2">Status</span>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-xs font-semibold dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-2">Source</span>
            <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-xs font-semibold dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-100 dark:border-gray-800 pl-3">
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="px-3 py-1.5 bg-transparent border-none rounded-lg focus:ring-0 text-xs font-bold text-gray-600 dark:text-gray-400 cursor-pointer hover:text-primary-600 transition-colors"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden transition-all">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 animate-pulse"></div>
              <Spinner size="lg" />
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Fetching lead data...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-24">
            <EmptyState
              title="No leads found"
              description={searchInput || filters.status || filters.source ? "We couldn't find any leads matching your current filters." : "Your lead pipeline is empty. Ready to grow your business?"}
              action={!searchInput && !filters.status && !filters.source && (
                <Button onClick={openCreateModal} className="mt-4">Add Your First Lead</Button>
              )}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Client Name</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email Address</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Source</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Created Date</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-all duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(lead.status)} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                        {lead.source}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                          title="View & Edit"
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Delete Lead"
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

        {/* Improved Pagination */}
        {!loading && leads.length > 0 && (
          <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-900 gap-6">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Page <span className="text-gray-900 dark:text-gray-200">{currentPage}</span> of <span className="text-gray-900 dark:text-gray-200">{pagination.totalPages}</span>
              <span className="mx-2">•</span>
              Total <span className="text-gray-900 dark:text-gray-200">{pagination.total}</span> leads
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  // Basic windowing for pagination
                  if (pagination.totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum + (5 - i) > pagination.totalPages) {
                        pageNum = pagination.totalPages - 5 + i + 1;
                    }
                  }
                  if (pageNum > pagination.totalPages || pageNum < 1) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "min-w-[32px] h-8 flex items-center justify-center rounded-md text-xs font-bold transition-all",
                        currentPage === pageNum 
                          ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages || loading}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
              >
                <ChevronRight size={16} />
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
