import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Textarea,
  IconButton,
  Spinner,
  Chip,
  Button,
} from '@material-tailwind/react';
import {
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  ChatSessionResponse,
  sendChatMessage,
  TaskMessage,
  ChatSessionEvent,
  ChatSessionGenerateQuestionTaskEvent,
  getChatSession,
  uploadFile,
} from '../api/api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  file?: {
    id: string;
    name: string;
    size: number;
    type: string;
  };
}

interface AiAgentProps {
  className?: string;
  chatSession?: ChatSessionResponse | null;
  isCreatingSession?: boolean;
  chatEvents?: ChatSessionEvent[];
  onQuestionGenerated?: (questionData: {
    question: string;
    answer: string;
    solution: string;
    selections: [string, string, string, string, string] | null;
  }) => void;
  onNewSessionRequested?: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress?: number;
  isUploading?: boolean;
}

const AiAgent: React.FC<AiAgentProps> = ({
  className = '',
  chatSession,
  isCreatingSession,
  chatEvents = [],
  onQuestionGenerated,
  onNewSessionRequested,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskMessage | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-adjust textarea height when input message changes
  useEffect(() => {
    const textarea = document.querySelector(
      'textarea[placeholder*="메시지를 입력하세요"]',
    ) as HTMLTextAreaElement;
    if (textarea) {
      adjustTextareaHeight(textarea);
    }
  }, [inputMessage]);

  // Initialize messages from chat events
  useEffect(() => {
    const initialMessages: Message[] = [];

    // Only add welcome message if there are no existing chat events (new session)
    const hasExistingMessages = chatEvents && chatEvents.length > 0;

    if (!hasExistingMessages) {
      // New session - show welcome message
      initialMessages.push({
        id: 'welcome',
        content:
          '안녕하세요! 문제 편집에 도움이 필요하시면 언제든지 말씀해 주세요. 파일을 드래그해서 놓거나 붙여넣기로 업로드할 수 있습니다.',
        role: 'assistant',
        timestamp: new Date(),
      });
    }

    // Convert chat events to messages
    if (chatEvents && chatEvents.length > 0) {
      console.log('📨 Loading chat history:', chatEvents.length, 'events');

      chatEvents.forEach((event) => {
        const eventData = event as any; // Cast to any to access all properties

        if (eventData.type === 'message') {
          if (eventData.contents && eventData.contents.length > 0) {
            // Extract text from contents array
            const messageText = eventData.contents
              .filter((content: any) => content.type === 'text')
              .map((content: any) => content.text)
              .join('');

            if (messageText) {
              const message: Message = {
                id: `event-${eventData.id}`,
                content: messageText,
                role: eventData.speaker === 'user' ? 'user' : 'assistant',
                timestamp: new Date(eventData.createdAt),
              };

              initialMessages.push(message);
            }
          }
        }
      });

      console.log(
        '✅ Chat history loaded:',
        initialMessages.length - (hasExistingMessages ? 0 : 1),
        'messages',
      );
    }

    setMessages(initialMessages);
  }, [chatSession, chatEvents]);

  // 파일 처리 함수
  const handleFile = async (file: File) => {
    // 파일 크기 제한 (예: 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    // 지원되는 파일 타입 확인
    const supportedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!supportedTypes.includes(file.type)) {
      alert('지원되지 않는 파일 형식입니다.');
      return;
    }

    // 업로드 중 상태 설정
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
      // 실제 파일 업로드
      const result = await uploadFile(
        file,
        undefined,
        (progress) => {
          setUploadedFile(prev => prev ? {
            ...prev,
            uploadProgress: progress
          } : null);
        }
      );

      // 업로드 완료
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

  // 드래그 앤 드롭 이벤트 핸들러
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
      handleFile(files[0]); // 첫 번째 파일만 처리
    }
  };

  // 클립보드 paste 이벤트 핸들러
  const handlePaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files);
    if (files.length > 0) {
      handleFile(files[0]); // 첫 번째 파일만 처리
    }
  };

  // 파일 제거
  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !uploadedFile) || isLoading || !chatSession)
      return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content:
        inputMessage.trim() || (uploadedFile ? '파일을 업로드했습니다.' : ''),
      role: 'user',
      timestamp: new Date(),
      file: uploadedFile
        ? {
            id: uploadedFile.id,
            name: uploadedFile.name,
            size: uploadedFile.size,
            type: uploadedFile.type,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setUploadedFile(null); // 파일 전송 후 제거
    setIsLoading(true);
    setCurrentTask(null);
    setHasError(false); // 새 메시지 전송 시 에러 상태 초기화

    // AI 응답 메시지 초기화
    const aiResponseId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiResponseId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      // 업로드된 파일의 ID 수집
      const imageFileIds = uploadedFile && uploadedFile.id !== 'uploading' ? [uploadedFile.id] : [];
      
      await sendChatMessage(chatSession.id, messageToSend, {
        onPartialContent: (content: string) => {
          // 부분 콘텐츠로 AI 응답 업데이트
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiResponseId
                ? { ...msg, content: msg.content + content }
                : msg,
            ),
          );
        },
        onTaskUpdate: (task: TaskMessage) => {
          // 작업 상태 업데이트
          setCurrentTask(task);
        },
        onComplete: (completeMessage) => {
          // 완료 시 최종 메시지 설정
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiResponseId
                ? {
                    ...msg,
                    content: completeMessage.message.contents
                      .filter((c) => c.type === 'text')
                      .map((c) => c.text)
                      .join(''),
                    timestamp: new Date(completeMessage.message.createdAt),
                  }
                : msg,
            ),
          );
          setIsLoading(false);
          setCurrentTask(null);
        },
        onQuestionGenerated: (questionData) => {
          console.log(
            '🎯 AiAgent: onQuestionGenerated callback received:',
            questionData,
          );
          // 질문 생성 완료 시 부모 컴포넌트에 전달
          if (onQuestionGenerated) {
            console.log(
              '🎯 AiAgent: Calling parent onQuestionGenerated callback',
            );
            onQuestionGenerated(questionData);
            console.log('✅ AiAgent: Parent callback called successfully');
          } else {
            console.warn(
              '⚠️ AiAgent: No parent onQuestionGenerated callback provided',
            );
          }
        },
        onError: (error: Error) => {
          console.error('Chat message error:', error);

          // Extract more specific error message if it's a server error
          let errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
          if (error.message.includes('Server error:')) {
            errorMessage =
              'AI 서비스에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else if (error.message.includes('Invalid parameter')) {
            errorMessage =
              'AI 요청 처리 중 오류가 발생했습니다. 새로운 대화를 시작해주세요.';
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiResponseId ? { ...msg, content: errorMessage } : msg,
            ),
          );
          setIsLoading(false);
          setCurrentTask(null);
          setHasError(true); // 에러 상태 설정
        },
      }, imageFileIds);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiResponseId
            ? { ...msg, content: '메시지 전송에 실패했습니다.' }
            : msg,
        ),
      );
      setIsLoading(false);
      setCurrentTask(null);
      setHasError(true); // catch 블록에서도 에러 상태 설정
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120; // max-h-[120px]
    const minHeight = 40; // min-h-[40px]

    if (scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    } else if (scrollHeight < minHeight) {
      textarea.style.height = `${minHeight}px`;
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none border-b border-blue-gray-50 p-4 flex-shrink-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CpuChipIcon className="h-5 w-5 text-blue-500" />
            <Typography variant="h6" color="blue-gray">
              AI Assistant
            </Typography>
          </div>

          {/* Chat Session Status */}
          {isCreatingSession && (
            <div className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              <Typography variant="small" color="gray">
                세션 생성 중...
              </Typography>
            </div>
          )}

          {chatSession && !isCreatingSession && (
            <div className="flex items-center gap-2">
              <Chip
                value="세션 활성"
                variant="ghost"
                color="green"
                size="sm"
                className="capitalize"
              />
              {hasError && onNewSessionRequested && (
                <Button
                  variant="outlined"
                  color="red"
                  size="sm"
                  onClick={onNewSessionRequested}
                  className="text-xs px-2 py-1"
                >
                  새 세션
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Chat Session Info */}
        {chatSession && (
          <div className="mt-2 p-2 bg-green-50 rounded-lg">
            <Typography variant="small" color="green" className="font-medium">
              세션 ID: {chatSession.id.substring(0, 8)}...
            </Typography>
            <Typography variant="small" color="gray" className="text-xs">
              메시지: {chatSession.messageCount} | 이벤트:{' '}
              {chatSession.eventCount}
            </Typography>

            {/* Task Status */}
            {currentTask && (
              <div className="mt-1 flex items-center gap-1">
                <Spinner className="h-3 w-3" />
                <Typography variant="small" color="blue" className="text-xs">
                  {currentTask.taskType === 'processing' &&
                    currentTask.phase === 'pre' &&
                    '처리 중...'}
                  {currentTask.taskType === 'processing' &&
                    currentTask.phase === 'post' &&
                    '완료 처리 중...'}
                  {currentTask.taskType === 'generate-question' &&
                    currentTask.phase === 'pre' &&
                    '문제 생성 중...'}
                  {currentTask.taskType === 'generate-question' &&
                    currentTask.phase === 'post' &&
                    '문제 생성 완료 중...'}
                  {currentTask.taskType === 'read-question' &&
                    currentTask.phase === 'pre' &&
                    '문제 읽기 중...'}
                  {currentTask.taskType === 'read-question' &&
                    currentTask.phase === 'post' &&
                    '문제 읽기 완료 중...'}
                </Typography>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardBody className="flex-1 overflow-hidden p-0 flex flex-col">
        {/* Messages Area */}
        <div
          ref={dropZoneRef}
          className={`flex-1 overflow-y-auto p-3 space-y-3 ${
            isDragOver
              ? 'bg-blue-50 border-2 border-dashed border-blue-300'
              : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 z-10">
              <div className="text-center">
                <DocumentIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <Typography variant="h6" color="blue">
                  파일을 여기에 놓으세요
                </Typography>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user'
                  ? 'justify-end pl-2'
                  : 'justify-start pr-2'
              }`}
            >
              <div
                className={`rounded-lg p-4 shadow-md ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'max-w-[80%] bg-white text-black border'
                }`}
              >
                {message.file && (
                  <div
                    className={`mb-2 p-2 rounded flex items-center gap-2 ${
                      message.role === 'user' ? 'bg-blue-400' : 'bg-gray-50'
                    }`}
                  >
                    <DocumentIcon className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <Typography
                        variant="small"
                        className="truncate font-medium"
                      >
                        {message.file.name}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-xs opacity-70"
                      >
                        {formatFileSize(message.file.size)}
                      </Typography>
                    </div>
                  </div>
                )}
                <Typography variant="small" className="whitespace-pre-wrap">
                  {message.content}
                </Typography>
                {message.role === 'assistant' &&
                  isLoading &&
                  message.id === messages[messages.length - 1]?.id && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                      <Spinner className="h-4 w-4 text-gray-400" />
                      <Typography variant="small" className="text-gray-500">
                        AI가 응답을 생성하고 있습니다...
                      </Typography>
                    </div>
                  )}
                <Typography
                  variant="small"
                  className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-blue-gray-50 p-3 flex-shrink-0">
          {/* 업로드된 파일 표시 */}
          {uploadedFile && (
            <div className="mb-3">
              <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-3 py-2 flex items-center gap-2 relative">
                <DocumentIcon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="truncate max-w-[200px] text-sm font-medium">
                    {uploadedFile.name}
                  </span>
                  <span className="text-xs opacity-70 ml-1">
                    ({formatFileSize(uploadedFile.size)})
                  </span>
                </div>
                
                {/* 업로드 진행 상태 */}
                {uploadedFile.isUploading && (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-3 w-3" />
                    <span className="text-xs">
                      {uploadedFile.uploadProgress || 0}%
                    </span>
                  </div>
                )}
                
                {/* 제거 버튼 */}
                {!uploadedFile.isUploading && (
                  <button
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 p-1 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              
              {/* 업로드 진행률 바 */}
              {uploadedFile.isUploading && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadedFile.uploadProgress || 0}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Textarea
                placeholder={
                  chatSession
                    ? '메시지를 입력하세요...'
                    : '채팅 세션 생성 중...'
                }
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                onKeyDown={handleKeyPress}
                onPaste={handlePaste}
                disabled={isLoading || !chatSession}
                className="min-h-[40px] max-h-[120px] resize-none overflow-hidden"
                rows={1}
              />
            </div>
            <IconButton
              variant="filled"
              color="blue"
              onClick={handleSendMessage}
              disabled={
                (!inputMessage.trim() && !uploadedFile) ||
                isLoading ||
                !chatSession ||
                (uploadedFile?.isUploading)
              }
              className="flex-shrink-0 mb-1"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AiAgent;
