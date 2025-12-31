export function copyText(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export const Subjects: SubjectType[] = [
  'math',
  'science',
  'korean',
  'english',
  'society',
];

export const SubjectString: { [key in SubjectType]: string } = {
  math: '수학',
  science: '과학',
  society: '사회',
  english: '영어',
  korean: '국어',
};

export const SubjectDetails: { [key in SubjectType]: string[] } = {
  math: [
    '공통수학1',
    '공통수학2',
    '기본수학1',
    '기본수학2',
    '대수',
    '미적분 I',
    '확률과 통계',
  ],
  science: [
    '통합과학1',
    '통합과학2',
    '과학탐구실험1',
    '과학탐구실험2',
    '물리학',
    '화학',
    '생명과학',
    '지구과학',
  ],
  society: [
    '한국사1',
    '한국사2',
    '통합사회1',
    '통합사회2',
    '세계시민과 지리',
    '세계사',
    '사회와 문화',
    '현대사회와 윤리',
  ],
  english: [
    '공통영어1',
    '공통영어2',
    '기본영어1',
    '기본영어2',
    '영어 I',
    '영어 II',
    '영어 독해와 작문',
  ],
  korean: ['공통국어1', '공통국어2', '화법과 언어', '독서와 작문', '문학'],
};

export const PromptRoles: string[] = ['developer', 'user'];

//#region pdf
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';

GlobalWorkerOptions.workerSrc = workerSrc;

export function checkFileType(file: File): 'image' | 'pdf' | 'unsupported' {
  const type = file.type;
  if (type.startsWith('image/')) {
    return 'image';
  } else if (type === 'application/pdf') {
    return 'pdf';
  } else {
    return 'unsupported';
  }
}

export async function getPdf(file: File) {
  console.log('a');
  const pdf = await getDocument(URL.createObjectURL(file)).promise;
  return pdf;
}

export async function pdfPageToImage(
  pdf: PDFDocumentProxy,
  index: number,
): Promise<string> {
  if (index < 0 || index >= pdf.numPages) {
    throw new Error(
      `Invalid page index ${index}. PDF has ${pdf.numPages} pages.`,
    );
  }

  const page = await pdf.getPage(index + 1); // PDF는 1-based 인덱스
  const viewport = page.getViewport({ scale: 3 });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({ canvasContext: context, viewport }).promise;

  return canvas.toDataURL('image/png');
}

export function fileToImageBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('이미지 파일이 아닙니다.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

//#endregion
