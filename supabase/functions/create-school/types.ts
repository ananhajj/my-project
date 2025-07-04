
export interface SchoolCreationRequest {
  school_name: string;
  phone?: string;
  subscription_months: number;
}

export interface SchoolCreationResponse {
  success: boolean;
  school?: any;
  credentials?: {
    email: string;
    password: string;
    subscription_id: string;
  };
  message?: string;
  error?: string;
  details?: string;
}

export interface GeneratedCredentials {
  email: string;
  password: string;
  subscriptionId: string;
  subscriptionEndDate: string;
}
