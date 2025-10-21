export interface AcademicEvent {
    id: number;
    startDate: string; // 일관성을 위해 ISO 문자열 사용
    endDate: string;   // 일관성을 위해 ISO 문자열 사용
    title: string;
    description: string;
    type: string;
  }
  