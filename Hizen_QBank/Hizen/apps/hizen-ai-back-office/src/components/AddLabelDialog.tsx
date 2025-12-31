import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Spinner,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { SubjectString } from '../utils';
import toast from 'react-hot-toast';
import short from 'short-uuid';

// Sample data interfaces
interface Label {
  id: string;
  content: string;
  subject: string;
  color?: string;
}

type SubjectType = 'science' | 'math' | 'english' | 'korean' | 'society';

// Sample labels data
const SAMPLE_LABELS: Label[] = [
  { id: '1', content: '물리학', subject: 'science', color: '#3B82F6' },
  { id: '2', content: '화학', subject: 'science', color: '#10B981' },
  { id: '3', content: '대수학', subject: 'math', color: '#F59E0B' },
  { id: '4', content: '기하학', subject: 'math', color: '#EF4444' },
  { id: '5', content: '문법', subject: 'english', color: '#8B5CF6' },
  { id: '6', content: '독해', subject: 'english', color: '#06B6D4' },
  { id: '7', content: '한국사', subject: 'society', color: '#F97316' },
  { id: '8', content: '세계사', subject: 'society', color: '#84CC16' },
  { id: '9', content: '문학', subject: 'korean', color: '#EC4899' },
  { id: '10', content: '작문', subject: 'korean', color: '#6366F1' },
];

interface AddLabelDialogProps {
  open: boolean;
  onClose: () => void;
  selectedLabelIds: string[];
  onLabelsUpdate: (updatedLabelIds: string[]) => void;
  subject?: string;
}

const AddLabelDialog: React.FC<AddLabelDialogProps> = ({
  open,
  onClose,
  selectedLabelIds,
  onLabelsUpdate,
  subject = '',
}) => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>(subject || '');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newLabelContent, setNewLabelContent] = useState<string>('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  const fetchLabels = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call with sample data
      await new Promise((resolve) => setTimeout(resolve, 300));

      let filteredLabels = SAMPLE_LABELS;

      if (filterSubject) {
        filteredLabels = SAMPLE_LABELS.filter(
          (label) => label.subject === filterSubject,
        );
      }

      if (searchTerm) {
        filteredLabels = filteredLabels.filter((label) =>
          label.content.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setLabels(filteredLabels);
    } catch (error) {
      console.error('Error fetching labels:', error);
      toast.error('라벨 로딩 실패');
      setLabels([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterSubject, searchTerm]);

  useEffect(() => {
    if (open) {
      setTempSelectedIds([...selectedLabelIds]);
      fetchLabels();
    }
  }, [open, selectedLabelIds, fetchLabels]);

  const handleToggleLabel = (labelId: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  };

  const handleAddNewLabel = async () => {
    if (!newLabelContent.trim() || !subject) {
      toast.error(
        'Label content cannot be empty and subject must be selected.',
      );
      return;
    }
    setIsCreating(true);
    try {
      // Simulate adding new label
      const newLabel = {
        id: short.generate(),
        content: newLabelContent.trim(),
        subject: subject,
      };
      setLabels((prev) => [...prev, newLabel]);
      setTempSelectedIds((prev) => [...prev, newLabel.id]);
      setNewLabelContent('');
      toast.success('New label added!');
    } catch (error) {
      console.error('Error adding new label:', error);
      toast.error('Failed to add new label.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirm = () => {
    onLabelsUpdate(tempSelectedIds);
    onClose();
  };

  const availableLabels = labels.filter(
    (label) =>
      !selectedLabelIds.includes(label.id) ||
      tempSelectedIds.includes(label.id),
  );

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Add Labels</DialogHeader>
      <DialogBody divider className="flex flex-col gap-4 min-h-[200px]">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        )}
        {!isLoading && !subject && (
          <Typography color="gray">
            Please select a subject in the main form to see or add labels.
          </Typography>
        )}
        {!isLoading && subject && (
          <>
            <Typography variant="h6" color="blue-gray">
              Existing Labels for {subject}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {availableLabels.length > 0 ? (
                availableLabels.map((label) => (
                  <div
                    key={label.id}
                    onClick={() => handleToggleLabel(label.id)}
                    className="cursor-pointer"
                  >
                    <Chip
                      variant={
                        tempSelectedIds.includes(label.id) ? 'filled' : 'ghost'
                      }
                      color="blue"
                      value={label.content}
                    />
                  </div>
                ))
              ) : (
                <Typography variant="small" color="gray">
                  No existing labels for this subject.
                </Typography>
              )}
            </div>

            <div className="mt-4">
              {!isCreating ? (
                <Button
                  variant="text"
                  color="blue"
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create New Label
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    label="New Label Content"
                    value={newLabelContent}
                    onChange={(e) => setNewLabelContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isCreating) {
                        handleAddNewLabel();
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      color="blue"
                      onClick={handleAddNewLabel}
                      loading={isCreating}
                      disabled={!newLabelContent.trim()}
                    >
                      Save New Label
                    </Button>
                    <Button
                      variant="text"
                      color="gray"
                      onClick={() => {
                        setIsCreating(false);
                        setNewLabelContent('');
                      }}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogBody>
      <DialogFooter className="gap-2">
        <Button variant="text" color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleConfirm}
          disabled={isLoading || isCreating || !subject}
        >
          Confirm Selection
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddLabelDialog;
