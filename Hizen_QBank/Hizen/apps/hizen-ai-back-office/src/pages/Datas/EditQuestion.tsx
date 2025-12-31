import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Input,
  Tooltip,
  IconButton,
  Select,
  Option,
  Card,
  CardBody,
  CardHeader,
} from '@material-tailwind/react';
import { SubjectString, SubjectDetails } from '../../utils';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LexicalEditor from '../../components/LexicalEditor';
import { useUndoRedoState } from '../../hooks/useUndoRedoState';
import AiAgent from '../../components/AiAgent';
import {
  createChatSession,
  getChatSession,
  getChatSessionEvents,
  ChatSessionResponse,
  ChatSessionEvent,
} from '../../api/api';

interface QuestionDto {
  content: string;
  solution: string;
  answer: string;
  subject?: string;
  subjectDetail?: string;
  labels?: string[];
}

const EditQuestion = () => {
  const navigate = useNavigate();

  // Initialize with empty question data
  const initialQuestionData: QuestionDto = {
    content: '',
    solution: '',
    answer: '',
    subject: undefined,
    subjectDetail: undefined,
    labels: [],
  };

  const [
    editedQuestion,
    setEditedQuestionWithHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  ] = useUndoRedoState<QuestionDto>(initialQuestionData);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<ChatSessionResponse | null>(
    null,
  );
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [chatEvents, setChatEvents] = useState<ChatSessionEvent[]>([]);

  const hasChanges = useMemo(() => {
    if (!editedQuestion) {
      return false;
    }

    // Check if any field has content (since this is always a new question)
    return !!(
      editedQuestion.content ||
      editedQuestion.solution ||
      editedQuestion.answer ||
      editedQuestion.subject ||
      editedQuestion.subjectDetail ||
      (editedQuestion.labels && editedQuestion.labels.length > 0)
    );
  }, [editedQuestion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedQuestionWithHistory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: keyof QuestionDto,
    value: string | undefined,
  ) => {
    setEditedQuestionWithHistory((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'subject' && value !== prev.subject) {
        newState.subjectDetail = undefined;
      }
      return newState;
    });
  };

  const handleSaveClick = async () => {
    if (!editedQuestion || !hasChanges || isSaving) return;

    setIsSaving(true);
    try {
      // TODO: Implement API call to save question
      console.log('Saving question:', editedQuestion);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('새 질문 저장 완료!');
      navigate('/datas/questions');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const subjectDetails = useMemo(() => {
    const currentSubject = editedQuestion?.subject;
    return currentSubject
      ? SubjectDetails[currentSubject as keyof typeof SubjectDetails] ?? []
      : [];
  }, [editedQuestion?.subject]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSaving) return;

      const isModifier = event.ctrlKey || event.metaKey;

      if (isModifier && event.key === 's') {
        event.preventDefault();
        if (hasChanges) {
          handleSaveClick();
        }
      } else if (isModifier && event.key === 'z') {
        event.preventDefault();
        if (canUndo) {
          console.log('Undo triggered');
          undo();
        }
      } else if (
        isModifier &&
        (event.key === 'y' || (event.shiftKey && event.key === 'Z'))
      ) {
        event.preventDefault();
        if (canRedo) {
          console.log('Redo triggered');
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo, isSaving, hasChanges, handleSaveClick]);

  // 🧮 KaTeX 태그를 LexicalEditor 형태로 변환하는 함수
  const convertKaTeXTagsForLexical = (htmlString: string): string => {
    if (!htmlString) return htmlString;
    
    // Convert <katex display="true">formula</katex> to <span data-katex="true" data-formula="formula" data-display-mode="true"></span>
    let processed = htmlString.replace(
      /<katex\s+display="true"([^>]*)>(.*?)<\/katex>/g,
      (match, attrs, formula) => {
        return `<span data-katex="true" data-formula="${formula.trim()}" data-display-mode="true"></span>`;
      }
    );
    
    // Convert <katex>formula</katex> to <span data-katex="true" data-formula="formula" data-display-mode="false"></span>
    processed = processed.replace(
      /<katex([^>]*)>(.*?)<\/katex>/g,
      (match, attrs, formula) => {
        return `<span data-katex="true" data-formula="${formula.trim()}" data-display-mode="false"></span>`;
      }
    );
    
    return processed;
  };

  const handleContentChange = (html: string) => {
    setEditedQuestionWithHistory((prev) => ({ ...prev, content: html }));
  };

  const handleSolutionChange = (html: string) => {
    setEditedQuestionWithHistory((prev) => ({ ...prev, solution: html }));
  };

  const handleQuestionGenerated = (questionData: {
    question: string;
    answer: string;
    solution: string;
    selections: [string, string, string, string, string] | null;
  }) => {
    console.log(
      '🎯 EditQuestion: handleQuestionGenerated called with data:',
      questionData,
    );
    console.log(
      '📝 Question content length:',
      questionData.question?.length || 0,
    );
    console.log('📝 Answer content length:', questionData.answer?.length || 0);
    console.log(
      '📝 Solution content length:',
      questionData.solution?.length || 0,
    );

    // 🧮 KaTeX 태그 변환 처리
    const processedQuestion = convertKaTeXTagsForLexical(questionData.question);
    const processedSolution = convertKaTeXTagsForLexical(questionData.solution);
    
    // 변환 결과 로깅
    const questionHasKaTeX = questionData.question.includes('<katex>');
    const solutionHasKaTeX = questionData.solution.includes('<katex>');
    
    if (questionHasKaTeX || solutionHasKaTeX) {
      console.log('🧮 KaTeX 태그 변환 완료:', {
        question: questionHasKaTeX ? '✅ 변환됨' : '❌ 변환 불필요',
        solution: solutionHasKaTeX ? '✅ 변환됨' : '❌ 변환 불필요',
        원본_길이: questionData.question?.length || 0,
        변환_길이: processedQuestion?.length || 0
      });
    }

    // Update the form with generated data
    console.log('📝 EditQuestion: Updating form with generated data...');
    setEditedQuestionWithHistory((prev) => {
      const newState = {
        ...prev,
        content: processedQuestion,
        answer: questionData.answer,
        solution: processedSolution,
        // selections will be handled later if needed
      };
      console.log('📝 EditQuestion: New form state:', newState);
      return newState;
    });

    console.log('✅ EditQuestion: Form updated successfully');
    toast.success('AI가 문제를 생성했습니다! 폼에 자동으로 입력되었습니다.');
  };

  const initializeChatSession = async () => {
    setIsCreatingSession(true);
    try {
      // Check if there's an existing session ID in localStorage
      const storedSessionId = localStorage.getItem('edit-question-session-id');

      if (storedSessionId) {
        // Try to load existing session data and events
        try {
          // Load both session data and events in parallel
          const [sessionResponse, eventsResponse] = await Promise.all([
            getChatSession(storedSessionId),
            getChatSessionEvents(storedSessionId),
          ]);

          console.log(
            '📨 Retrieved existing session data and events:',
            eventsResponse.events?.length || 0,
            'events',
          );

          setChatSession(sessionResponse);

          // Update form with session data if available (with KaTeX conversion)
          if (
            sessionResponse.htmlQuestionContent ||
            sessionResponse.htmlSolutionContent ||
            sessionResponse.answer
          ) {
            console.log('📝 Loading session data into form');
            
            // 🧮 세션 데이터에도 KaTeX 변환 적용
            const processedSessionContent = convertKaTeXTagsForLexical(
              sessionResponse.htmlQuestionContent || ''
            );
            const processedSessionSolution = convertKaTeXTagsForLexical(
              sessionResponse.htmlSolutionContent || ''
            );
            
            // 세션 데이터에 KaTeX가 있는지 확인
            const sessionHasKaTeX = 
              (sessionResponse.htmlQuestionContent?.includes('<katex>') || false) ||
              (sessionResponse.htmlSolutionContent?.includes('<katex>') || false);
              
            if (sessionHasKaTeX) {
              console.log('🧮 세션 데이터 KaTeX 변환 완료');
            }
            
            setEditedQuestionWithHistory((prev) => ({
              ...prev,
              content: processedSessionContent || prev.content,
              solution: processedSessionSolution || prev.solution,
              answer: sessionResponse.answer || prev.answer,
            }));
          }

          // Handle both wrapped response { events: [...] } and direct array [...]
          const events = eventsResponse.events || eventsResponse;
          setChatEvents(Array.isArray(events) ? events : []);
          toast.success('기존 채팅 세션을 불러왔습니다!');
          console.log('✅ Existing session loaded:', storedSessionId);
          return; // Exit early, don't create new session
        } catch (error) {
          console.log('⚠️ Stored session invalid, creating new one');
          localStorage.removeItem('edit-question-session-id');
        }
      }

      // Create new session if no valid existing session
      if (!localStorage.getItem('edit-question-session-id')) {
        const sessionData = await createChatSession({
          htmlQuestionContent: editedQuestion.content || '',
          htmlSolutionContent: editedQuestion.solution || '',
          answer: editedQuestion.answer || '',
          selections: editedQuestion.labels || [],
        });

        setChatSession(sessionData);
        localStorage.setItem('edit-question-session-id', sessionData.id);
        console.log('✅ New session created:', sessionData.id);
        toast.success('채팅 세션이 자동으로 생성되었습니다!');
      }
    } catch (error) {
      console.error('❌ Failed to initialize chat session:', error);
      toast.error('채팅 세션 초기화 중 오류가 발생했습니다.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleNewSessionRequested = () => {
    console.log('🔄 Starting new AI session...');

    // Clear existing session from localStorage
    localStorage.removeItem('edit-question-session-id');

    // Reset chat state
    setChatSession(null);
    setChatEvents([]);

    // Create new session
    initializeChatSession();

    toast.success('AI 세션이 초기화되었습니다. 새로운 대화를 시작하세요!');
  };

  // Auto-create or load chat session on page load
  useEffect(() => {
    initializeChatSession();
  }, []); // Empty dependency array - only run on mount

  return (
    // Header 높이만큼 빼서 안에 height 정의
    <div style={{ height: 'calc(100vh - 80px)' }}>
      {/* 양옆으로 나누기 */}
      <div className="flex h-full">
        {/* 왼쪽 영역 - relative */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* 새 문제 추가 header */}
          <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <Typography variant="h5" color="blue-gray">
                새 문제 추가
              </Typography>
            </div>

            <div className="flex items-center gap-2">
              {/* Undo/Redo Controls */}
              <Tooltip content="Undo (Ctrl+Z)">
                <IconButton
                  variant="text"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo || isSaving}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                </IconButton>
              </Tooltip>
              <Tooltip content="Redo (Ctrl+Y)">
                <IconButton
                  variant="text"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo || isSaving}
                >
                  <ArrowUturnRightIcon className="h-5 w-5" />
                </IconButton>
              </Tooltip>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <Tooltip content="AI 채팅 세션을 초기화하고 새로운 대화를 시작합니다">
                <Button
                  variant="outlined"
                  color="blue"
                  onClick={handleNewSessionRequested}
                  disabled={isSaving || isCreatingSession}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isCreatingSession ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      AI 세션 초기화
                    </>
                  )}
                </Button>
              </Tooltip>
              <Button
                variant="gradient"
                color="green"
                onClick={handleSaveClick}
                loading={isSaving}
                disabled={!hasChanges || isSaving}
                size="sm"
              >
                저장 (Ctrl+S)
              </Button>
            </div>
          </div>

          {/* Content 영역 - 스크롤 */}
          <div className="flex-1 overflow-y-auto p-1">
            <div>
              <div className="space-y-1">
                {/* Subject Selection */}
                <Card>
                  <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none p-4 border-b"
                  >
                    <Typography variant="h6" color="blue-gray">
                      과목 정보
                    </Typography>
                  </CardHeader>
                  <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="과목 분류"
                        value={editedQuestion.subject ?? ''}
                        onChange={(val) => handleSelectChange('subject', val)}
                        disabled={isSaving}
                        name="subject"
                      >
                        {Object.keys(SubjectString).map((subjKey) => (
                          <Option key={subjKey} value={subjKey}>
                            {
                              SubjectString[
                                subjKey as keyof typeof SubjectString
                              ]
                            }
                          </Option>
                        ))}
                      </Select>
                      <Select
                        label="세부 과목"
                        key={editedQuestion.subject}
                        value={editedQuestion.subjectDetail ?? ''}
                        onChange={(val) =>
                          handleSelectChange('subjectDetail', val)
                        }
                        disabled={isSaving || !editedQuestion.subject}
                        name="subjectDetail"
                      >
                        {subjectDetails.map((detail: string) => (
                          <Option value={detail} key={detail}>
                            {detail}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </CardBody>
                </Card>

                {/* Content Editor */}
                <Card>
                  <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none p-4 border-b"
                  >
                    <Typography variant="h6" color="blue-gray">
                      문제 내용 (Content)
                    </Typography>
                  </CardHeader>
                  <CardBody className="p-4">
                    <LexicalEditor
                      initialHtml={editedQuestion.content}
                      onChange={handleContentChange}
                      stableKey="new-question-content"
                    />
                  </CardBody>
                </Card>

                {/* Solution Editor */}
                <Card>
                  <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none p-4 border-b"
                  >
                    <Typography variant="h6" color="blue-gray">
                      풀이 (Solution)
                    </Typography>
                  </CardHeader>
                  <CardBody className="p-4">
                    <LexicalEditor
                      initialHtml={editedQuestion.solution}
                      onChange={handleSolutionChange}
                      stableKey="new-question-solution"
                    />
                  </CardBody>
                </Card>

                {/* Answer Input */}
                <Card>
                  <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none p-4 border-b"
                  >
                    <Typography variant="h6" color="blue-gray">
                      정답 (Answer)
                    </Typography>
                  </CardHeader>
                  <CardBody className="p-4">
                    <Input
                      type="text"
                      label="정답 (Answer)"
                      name="answer"
                      value={editedQuestion.answer ?? ''}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      size="lg"
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 - AI Agent (fix 할 필요 없음) */}
        <div className="w-80 bg-white border-l border-gray-200">
          <AiAgent
            className="h-full"
            chatSession={chatSession}
            isCreatingSession={isCreatingSession}
            chatEvents={chatEvents}
            onQuestionGenerated={handleQuestionGenerated}
            onNewSessionRequested={handleNewSessionRequested}
          />
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
