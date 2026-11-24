export interface QuestionRequest {
    question: string;
    top_n?: number;
    similarity_threshold?: number;
  }
  
  export interface QuestionResponse {
    Response: string;
    confidence: number;
    question_matched?: string;
    similar_questions?: string[];
  }
  
  export interface ContentItem {
    Question: string;
    Response: string;
  }
  
  export interface ApiResponse {
    status: string;
    message: string;
    total_entries?: number;
  }
  
  export interface FileOperation {
    action: 'save' | 'load';
    filepath: string;
    file_format: 'json' | 'csv' | 'excel';
  }