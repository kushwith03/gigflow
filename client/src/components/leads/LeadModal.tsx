import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { leadService } from '@/services/lead.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/ui/Modal';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: any; // If provided, we're editing
}

export const LeadModal = ({ isOpen, onClose, onSuccess, lead }: LeadModalProps) => {
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead || {
      status: 'New',
      source: 'Website',
    },
  });

  // Reset form when modal opens/closes or lead changes
  React.useEffect(() => {
    if (isOpen) {
      reset(lead || { status: 'New', source: 'Website' });
    }
  }, [isOpen, lead, reset]);

  const onSubmit = async (data: LeadFormValues) => {
    try {
      if (isEditing) {
        await leadService.updateLead(lead._id, data);
        toast.success('Lead updated successfully');
      } else {
        await leadService.createLead(data);
        toast.success('Lead created successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{isEditing ? 'Edit Lead' : 'Create New Lead'}</ModalTitle>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Input
            label="Name"
            placeholder="Lead name"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            placeholder="lead@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Source</label>
              <select
                {...register('source')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          <ModalFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Create Lead'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
import React from 'react';
