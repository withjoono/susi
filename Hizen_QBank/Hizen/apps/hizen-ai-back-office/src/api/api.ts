import axios from 'axios';
import { createParser, type EventSourceMessage } from 'eventsource-parser';

// Configure axios defaults
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token and check expiry
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expiresAt');

  if (token && expiresAt) {
    const now = new Date();
    const expiry = new Date(expiresAt);

    if (now >= expiry) {
      console.log(
        'Token expired during API call - clearing storage and redirecting to login',
      );
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      window.location.href = '/auth/signin';
      return Promise.reject(new Error('Token expired'));
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      // Redirect to login
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  },
);

export interface SignInResponse {
  token: string;
  expiresAt: string;
}

export interface ChatSessionResponse {
  id: string;
  eventCount: number;
  messageCount: number;
  htmlQuestionContent: string;
  htmlSolutionContent: string;
  answer: string;
  selections: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatSessionRequest {
  htmlQuestionContent?: string;
  htmlSolutionContent?: string;
  answer?: string;
  selections?: string[];
}

// SSE Message types from the backend
export interface ChatMessageEvent {
  speaker: 'user' | 'assistant';
  contents: Array<{
    text: string;
    type: string;
  }>;
  id: string;
  order: number;
  createdAt: string;
  type: 'message';
}

export interface ChatTaskEvent {
  taskId: string;
  taskType: string;
  taskPhase: 'pre' | 'post';
  id: string;
  order: number;
  createdAt: string;
  type: 'task';
}

export type ChatSessionEvent = ChatMessageEvent | ChatTaskEvent;

// Base types
export type ChatSessionTaskPhase = 'pre' | 'post' | 'error';

// Main union type
export type ChatSessionThreadEvent =
  | ChatSessionErrorEvent
  | ChatSessionProcessingTaskEvent
  | ChatSessionReadQuestionTaskEvent
  | ChatSessionGenerateQuestionTaskEvent
  | ChatSessionStreamingMessageEvent
  | ChatSessionStreamingMessageCompleteEvent;

// 1. Error Event
export interface ChatSessionErrorEvent {
  type: 'error';
  error: unknown;
}

// 2. Processing Task Event
export interface ChatSessionProcessingTaskEvent {
  type: 'task';
  id: string;
  taskType: 'processing';
  phase: ChatSessionTaskPhase;
  error?: unknown;
}

// 3. Read Question Task Event
export interface ChatSessionReadQuestionTaskEvent {
  type: 'task';
  id: string;
  taskType: 'read-question';
  phase: ChatSessionTaskPhase;
  error?: unknown;
}

// 4. Generate Question Task Event
export interface ChatSessionGenerateQuestionTaskEvent {
  type: 'task';
  id: string;
  taskType: 'generate-question';
  phase: ChatSessionTaskPhase;
  error?: unknown;
  generatedQuestion?: string;
  generatedAnswer?: string;
  generatedSolution?: string;
  generatedSelections?: [string, string, string, string, string] | null;
  // 서버 응답에서 오는 실제 필드들
  htmlQuestionContent?: string;
  htmlSolutionContent?: string;
  answer?: string;
  selections?: string[];
}

// 5. Streaming Message Event (partial content)
export interface ChatSessionStreamingMessageEvent {
  type: 'assistant-chat-partial-content';
  partialContent: string;
}

// 6. Streaming Message Complete Event
export interface ChatSessionStreamingMessageCompleteEvent {
  type: 'assistant-chat-complete';
  message: ThreadMessageEvent;
}

// Supporting types from thread.dto.ts
export interface ThreadMessageEvent {
  id: string;
  order: number;
  createdAt: Date;
  type: 'message';
  speaker: 'user' | 'assistant';
  contents: ThreadMessageContent[];
}

export type ThreadMessageContent =
  | ThreadMessageContentText
  | ThreadMessageContentImage;

export interface ThreadMessageContentText {
  type: 'text';
  text: string;
}

export interface ThreadMessageContentImage {
  type: 'image';
  imageUrl: string;
}

// Legacy types for backward compatibility
export interface TaskMessage {
  type: 'task';
  id: string;
  taskType: string;
  phase: 'pre' | 'post';
}

export interface PartialContentMessage {
  type: 'assistant-chat-partial-content';
  partialContent: string;
}

export interface CompleteMessage {
  type: 'assistant-chat-complete';
  message: {
    id: string;
    order: number;
    createdAt: string;
    type: string;
    speaker: string;
    contents: Array<{
      type: string;
      text: string;
    }>;
  };
}

export type ChatStreamMessage =
  | TaskMessage
  | PartialContentMessage
  | CompleteMessage;

export interface ChatMessageCallbacks {
  onPartialContent: (content: string) => void;
  onTaskUpdate: (task: TaskMessage) => void;
  onComplete: (message: CompleteMessage) => void;
  onError: (error: Error) => void;
  onQuestionGenerated?: (questionData: {
    question: string;
    answer: string;
    solution: string;
    selections: [string, string, string, string, string] | null;
  }) => void;
}

export interface ChatSessionEventsResponse {
  events: ChatSessionEvent[];
  sessionId: string;
}

export interface SendChatMessageRequest {
  message: string;
  imageFileIds?: string[];
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>('/user-sessions', {
    email,
    password,
  });

  return response.data;
}

export async function createChatSession(
  data: CreateChatSessionRequest,
): Promise<ChatSessionResponse> {
  const response = await api.post<ChatSessionResponse>('/chat-sessions', data);
  return response.data;
}

export async function getChatSession(
  sessionId: string,
): Promise<ChatSessionResponse> {
  try {
    console.log('🔍 Getting chat session data for session:', sessionId);
    const response = await api.get<ChatSessionResponse>(
      `/chat-sessions/${sessionId}`,
    );
    console.log('📨 Chat session response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch chat session:', error);
    throw error;
  }
}

export async function getChatSessionEvents(
  sessionId: string,
): Promise<ChatSessionEventsResponse> {
  console.log('🔍 Getting chat session events for session:', sessionId);

  const response = await api.get<ChatSessionEventsResponse>(
    `/chat-sessions/${sessionId}/events`,
  );

  console.log('📨 Chat session events response:', response.data);
  console.log('📊 Response type:', typeof response.data);
  console.log('📊 Is array:', Array.isArray(response.data));

  // Check if response.data is directly an array (not wrapped in { events: [...] })
  if (Array.isArray(response.data)) {
    console.log('⚠️ Response is direct array, wrapping it');
    const wrappedResponse = {
      events: response.data as ChatSessionEvent[],
      sessionId: sessionId,
    };
    console.log('📦 Wrapped response:', wrappedResponse);
    console.log('📊 Events count:', wrappedResponse.events?.length || 0);
    return wrappedResponse;
  }

  console.log('📊 Events count:', response.data.events?.length || 0);

  return response.data;
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  callbacks: ChatMessageCallbacks,
  imageFileIds?: string[],
): Promise<void> {
  try {
    // Use axios config for consistent URL building and auth headers
    const token = localStorage.getItem('token');
    const config = api.defaults;
    const baseURL = config.baseURL?.replace(/\/$/, ''); // Remove trailing slash

    const response = await fetch(
      `${baseURL}/chat-sessions/${sessionId}/response`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ 
          message,
          imageFileIds: imageFileIds || []
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }

    const decoder = new TextDecoder();
    let isCompleted = false;

    // Create eventsource parser
    const parser = createParser({
      onEvent: (event: EventSourceMessage) => {
        if (event.data === '[DONE]') {
          console.log('✅ SSE Stream completed');
          isCompleted = true;
          return;
        }

        if (event.data) {
          // Handle [ERROR] messages that are not JSON
          if (event.data.startsWith('[ERROR]')) {
            console.error('🚨 Server error string:', event.data);
            callbacks.onError(new Error(event.data));
            return;
          }

          try {
            const parsedMessage = JSON.parse(event.data);

            // Check if this is an error event
            if (parsedMessage.type === 'error') {
              console.error('🚨 Server error event:', parsedMessage);
              const errorMessage = parsedMessage.error?.includes?.('[ERROR]')
                ? parsedMessage.error
                : `Server error: ${JSON.stringify(parsedMessage)}`;
              callbacks.onError(new Error(errorMessage));
              return;
            }

            // Handle other message types
            switch (parsedMessage.type) {
              case 'assistant-chat-partial-content':
                callbacks.onPartialContent(parsedMessage.partialContent);
                break;

              case 'task':
                console.log(
                  '📋 Task update:',
                  parsedMessage.taskType,
                  parsedMessage.phase,
                );
                callbacks.onTaskUpdate(parsedMessage);

                // Check if this is a generate-question task completion
                if (
                  parsedMessage.taskType === 'generate-question' &&
                  parsedMessage.phase === 'post' &&
                  callbacks.onQuestionGenerated
                ) {
                  console.log(
                    '🎯 Generate-question completed - processing data...',
                  );

                  // Cast to the specific task type to access generated data
                  const generateQuestionTask =
                    parsedMessage as any as ChatSessionGenerateQuestionTaskEvent;

                  // Check for both old format (generatedQuestion) and new format (htmlQuestionContent)
                  const hasOldFormat =
                    generateQuestionTask.generatedQuestion &&
                    generateQuestionTask.generatedAnswer &&
                    generateQuestionTask.generatedSolution;

                  const hasNewFormat =
                    generateQuestionTask.htmlQuestionContent &&
                    generateQuestionTask.answer &&
                    generateQuestionTask.htmlSolutionContent;

                  if (hasOldFormat || hasNewFormat) {
                    // Use new format if available, otherwise fall back to old format
                    const questionData = {
                      question:
                        generateQuestionTask.htmlQuestionContent ||
                        generateQuestionTask.generatedQuestion ||
                        '',
                      answer:
                        generateQuestionTask.answer ||
                        generateQuestionTask.generatedAnswer ||
                        '',
                      solution:
                        generateQuestionTask.htmlSolutionContent ||
                        generateQuestionTask.generatedSolution ||
                        '',
                      selections:
                        generateQuestionTask.generatedSelections || null,
                    };

                    console.log('✅ Question generated successfully');
                    callbacks.onQuestionGenerated(questionData);
                  } else {
                    console.warn(
                      '⚠️ No valid question data found in generate-question task',
                    );
                  }
                }
                break;

              case 'assistant-chat-complete':
                console.log('✅ Chat complete');
                callbacks.onComplete(parsedMessage);
                break;

              case 'turn-end':
                console.log('🏁 Turn end - ending stream');
                isCompleted = true;
                break;

              default:
                console.log('❓ Unknown message type:', parsedMessage.type);
            }
          } catch (parseError) {
            console.error('❌ Failed to parse SSE message:', parseError);
            // Don't throw error for parse failures, just log them
          }
        }
      },
      onError: (error) => {
        console.error('EventSource parse error:', error);
        callbacks.onError(new Error('Failed to parse server response'));
      },
    });

    try {
      while (!isCompleted) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('✅ SSE stream ended');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        try {
          parser.feed(chunk);
        } catch (parseError) {
          console.error('❌ Error parsing chunk:', parseError);
          // Continue reading even if parsing fails
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Chat message error:', error);
    callbacks.onError(
      error instanceof Error ? error : new Error('Unknown error occurred'),
    );
  }
}

interface FileUploadResponse {
  file: {
    id: string;
    name: string;
    description: string|null;
    mimeType: string;
    createdAt: Date;
  };
  uploadUrl: {
    url: string;
    expiration: Date;
  };
}

export async function requestFileUpload(name: string, description: string|null, mimeType: string){
  try {
    const response = await api.post<FileUploadResponse>('/files', {
      name,
      description,
      mimeType,
    });
    return response.data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

export async function uploadFile(
  file: File,
  description?: string,
  onProgress?: (progress: number) => void
): Promise<{ fileId: string; fileName: string }> {
  try {
    // 1단계: 파일 정보를 보내서 presigned URL 받아오기
    console.log('Requesting file upload URL...');
    const uploadResponse = await requestFileUpload(
      file.name,
      description || null,
      file.type
    );

    console.log('Upload response:', uploadResponse);

    const { file: fileInfo, uploadUrl } = uploadResponse;
    console.log('Received upload URL:', uploadUrl.url);

    // 2단계: presigned URL을 사용해 실제 파일 업로드
    console.log('Uploading file to S3...');
    
    // 진행률 시뮬레이션 (fetch는 실제 업로드 진행률을 제공하지 않음)
    if (onProgress) {
      onProgress(0);
      // 업로드 시작을 나타내는 진행률
      setTimeout(() => onProgress(30), 100);
    }
    
    try {
      const response = await fetch(uploadUrl.url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      // 완료 진행률
      if (onProgress) {
        onProgress(100);
      }

      console.log('File uploaded successfully');
      return {
        fileId: fileInfo.id,
        fileName: fileInfo.name
      };
      
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Network error during file upload');
    }

  } catch (error) {
    console.error('File upload process failed:', error);
    throw error;
  }
}

/**
 * 여러 파일을 동시에 업로드하는 함수
 */
export async function uploadMultipleFiles(
  files: File[],
  description?: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<{ fileId: string; fileName: string }[]> {
  const uploadPromises = files.map((file, index) => 
    uploadFile(
      file, 
      description, 
      onProgress ? (progress) => onProgress(index, progress) : undefined
    )
  );
  
  return Promise.all(uploadPromises);
}

export default api;
