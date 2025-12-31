import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
  IconButton,
  Chip,
  Tooltip,
  Progress,
} from '@material-tailwind/react';
import {
  PlusIcon,
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { uploadFile } from '../../api/api';

interface Subject {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  name: string;
  description: string | null;
  sectionCount: number;
  createdAt: string;
  updatedAt: string;
  subject?: Subject;
}

interface DocumentSection {
  id: string;
  order: number;
  title: string;
  description: string | null;
  contentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress?: number;
  isUploading?: boolean;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [sections, setSections] = useState<DocumentSection[]>([]);
  
  // Modal states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjectId: '',
  });
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Mock data for development
  useEffect(() => {
    // TODO: Replace with actual API calls
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: '중학교 수학 1학년',
        description: '중학교 1학년 수학 교과서',
        sectionCount: 12,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
        subject: {
          id: 'math-1',
          name: '수학',
          description: '중학교 수학',
          parentId: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
      {
        id: '2',
        name: '중학교 영어 1학년',
        description: '중학교 1학년 영어 교과서',
        sectionCount: 8,
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        subject: {
          id: 'english-1',
          name: '영어',
          description: '중학교 영어',
          parentId: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    ];

    const mockSubjects: Subject[] = [
      {
        id: 'math-1',
        name: '수학',
        description: '중학교 수학',
        parentId: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'english-1',
        name: '영어',
        description: '중학교 영어',
        parentId: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'science-1',
        name: '과학',
        description: '중학교 과학',
        parentId: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setDocuments(mockDocuments);
    setSubjects(mockSubjects);
  }, []);

  // File handling functions
  const handleFile = async (file: File) => {
    // Check file type (PDF only)
    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }

    // File size limit (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('파일 크기는 50MB를 초과할 수 없습니다.');
      return;
    }

    setIsUploading(true);
    const tempFile: UploadedFile = {
      id: 'uploading',
      name: file.name,
      size: file.size,
      type: file.type,
      isUploading: true,
      uploadProgress: 0,
    };
    setUploadedFile(tempFile);

    try {
      const result = await uploadFile(
        file,
        '교과서 PDF 파일',
        (progress) => {
          setUploadedFile(prev => prev ? {
            ...prev,
            uploadProgress: progress
          } : null);
        }
      );

      setUploadedFile({
        id: result.fileId,
        name: result.fileName,
        size: file.size,
        type: file.type,
        isUploading: false,
        uploadProgress: 100,
      });
      setIsUploading(false);
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
      setUploadedFile(null);
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdd = () => {
    setFormData({ name: '', description: '', subjectId: '' });
    setUploadedFile(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setFormData({
      name: document.name,
      description: document.description || '',
      subjectId: document.subject?.id || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
    // TODO: Load document sections
  };

  const handleDelete = (document: Document) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = async () => {
    if (!formData.name.trim()) {
      alert('교과서 이름을 입력해주세요.');
      return;
    }

    if (!uploadedFile || uploadedFile.isUploading) {
      alert('PDF 파일을 업로드해주세요.');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement actual API call
      console.log('Adding document:', formData, uploadedFile);
      
      // Mock success
      alert('교과서가 성공적으로 추가되었습니다.');
      setIsAddDialogOpen(false);
      setFormData({ name: '', description: '', subjectId: '' });
      setUploadedFile(null);
      
    } catch (error) {
      console.error('Error adding document:', error);
      alert('교과서 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedDocument) return;

    try {
      setLoading(true);
      // TODO: Implement actual API call
      console.log('Editing document:', selectedDocument.id, formData);
      
      // Mock success
      alert('교과서가 성공적으로 수정되었습니다.');
      setIsEditDialogOpen(false);
      setSelectedDocument(null);
      
    } catch (error) {
      console.error('Error editing document:', error);
      alert('교과서 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectedDocument) return;

    try {
      setLoading(true);
      // TODO: Implement actual API call
      console.log('Deleting document:', selectedDocument.id);
      
      // Mock success
      alert('교과서가 성공적으로 삭제되었습니다.');
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
      
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('교과서 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Typography variant="h4" color="blue-gray" className="mb-2">
              교과서 관리
            </Typography>
            <Typography variant="paragraph" color="gray" className="font-normal">
              교과서 PDF 파일을 업로드하고 인덱싱하여 관리합니다.
            </Typography>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={handleAdd}
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4" />
            교과서 추가
          </Button>
        </div>

        {/* Documents Table */}
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h5" color="blue-gray">
                  교과서 목록
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  등록된 교과서 {documents.length}개
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      교과서명
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      과목
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      섹션 수
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      등록일
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      작업
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="flex items-center gap-3">
                        <DocumentIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {document.name}
                          </Typography>
                          {document.description && (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {document.description}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      {document.subject ? (
                        <Chip
                          variant="ghost"
                          color="blue"
                          size="sm"
                          value={document.subject.name}
                        />
                      ) : (
                        <Typography variant="small" color="gray">
                          -
                        </Typography>
                      )}
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {document.sectionCount}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(document.createdAt).toLocaleDateString('ko-KR')}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="flex items-center gap-2">
                        <Tooltip content="보기">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => handleView(document)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="수정">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => handleEdit(document)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="삭제">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => handleDelete(document)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <Typography variant="small" color="gray">
                        등록된 교과서가 없습니다.
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} handler={() => setIsAddDialogOpen(false)} size="lg">
        <DialogHeader>교과서 추가</DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              기본 정보
            </Typography>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="교과서명"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              <div className="w-full">
                <Select
                  label="과목 선택"
                  value={formData.subjectId}
                  onChange={(val) => handleInputChange('subjectId', val || '')}
                >
                  <Option value="">과목 선택</Option>
                  {subjects.map((subject) => (
                    <Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Textarea
                label="설명"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              PDF 파일 업로드
            </Typography>
            
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <DocumentIcon className="h-8 w-8" />
                    <div>
                      <Typography variant="small" className="font-medium">
                        {uploadedFile.name}
                      </Typography>
                      <Typography variant="small" className="text-gray-500">
                        {formatFileSize(uploadedFile.size)}
                      </Typography>
                    </div>
                    {!uploadedFile.isUploading && (
                      <button
                        onClick={handleRemoveFile}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {uploadedFile.isUploading && (
                    <div className="space-y-2">
                      <Progress value={uploadedFile.uploadProgress || 0} />
                      <Typography variant="small" color="blue-gray">
                        업로드 중... {uploadedFile.uploadProgress || 0}%
                      </Typography>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      PDF 파일을 드래그하여 업로드
                    </Typography>
                    <Typography variant="small" color="gray">
                      또는 클릭하여 파일 선택 (최대 50MB)
                    </Typography>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload">
                    <Button variant="outlined" component="span" className="pointer-events-none">
                      파일 선택
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsAddDialogOpen(false)}
            className="mr-1"
          >
            취소
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmitAdd}
            disabled={loading || isUploading}
          >
            추가
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} handler={() => setIsEditDialogOpen(false)} size="lg">
        <DialogHeader>교과서 수정</DialogHeader>
        <DialogBody className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="교과서명"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <div className="w-full">
              <Select
                label="과목 선택"
                value={formData.subjectId}
                onChange={(val) => handleInputChange('subjectId', val || '')}
              >
                <Option value="">과목 선택</Option>
                {subjects.map((subject) => (
                  <Option key={subject.id} value={subject.id}>
                    {subject.name}
                  </Option>
                ))}
              </Select>
            </div>
            <Textarea
              label="설명"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsEditDialogOpen(false)}
            className="mr-1"
          >
            취소
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleSubmitEdit}
            disabled={loading}
          >
            수정
          </Button>
        </DialogFooter>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} handler={() => setIsViewDialogOpen(false)} size="xl">
        <DialogHeader>
          교과서 상세보기
          {selectedDocument && (
            <Typography variant="small" color="gray" className="font-normal ml-2">
              {selectedDocument.name}
            </Typography>
          )}
        </DialogHeader>
        <DialogBody>
          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    교과서명
                  </Typography>
                  <Typography variant="small" color="gray">
                    {selectedDocument.name}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    과목
                  </Typography>
                  <Typography variant="small" color="gray">
                    {selectedDocument.subject?.name || '-'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    섹션 수
                  </Typography>
                  <Typography variant="small" color="gray">
                    {selectedDocument.sectionCount}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    등록일
                  </Typography>
                  <Typography variant="small" color="gray">
                    {new Date(selectedDocument.createdAt).toLocaleDateString('ko-KR')}
                  </Typography>
                </div>
              </div>
              
              {selectedDocument.description && (
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    설명
                  </Typography>
                  <Typography variant="small" color="gray">
                    {selectedDocument.description}
                  </Typography>
                </div>
              )}

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  섹션 목록
                </Typography>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Typography variant="small" color="gray" className="text-center">
                    섹션 관리 기능은 추후 구현 예정입니다.
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setIsViewDialogOpen(false)}
          >
            닫기
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} handler={() => setIsDeleteDialogOpen(false)}>
        <DialogHeader>교과서 삭제</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            정말로 이 교과서를 삭제하시겠습니까?
          </Typography>
          {selectedDocument && (
            <Typography variant="small" color="gray" className="mt-2">
              교과서명: {selectedDocument.name}
            </Typography>
          )}
          <Typography variant="small" color="red" className="mt-2">
            이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setIsDeleteDialogOpen(false)}
            className="mr-1"
          >
            취소
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleSubmitDelete}
            disabled={loading}
          >
            삭제
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Documents; 