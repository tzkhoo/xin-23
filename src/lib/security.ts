// Security utilities and configuration
import { toast } from "@/hooks/use-toast";

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 10,
  MAX_MESSAGE_LENGTH: 2000,
  MIN_MESSAGE_LENGTH: 1,
  
  // Input validation
  FORBIDDEN_PATTERNS: [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
  ],
  
  // Suspicious content patterns
  SUSPICIOUS_PATTERNS: [
    /SELECT.*FROM/gi,
    /DROP\s+TABLE/gi,
    /INSERT\s+INTO/gi,
    /DELETE\s+FROM/gi,
    /UNION\s+SELECT/gi,
    /<svg[^>]*onload/gi,
  ],
  
  // Webhook security
  WEBHOOK_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
} as const;

// Webhook URLs configuration (move from hardcoded)
export const WEBHOOK_ENDPOINTS = {
  NORMAL_MODE: import.meta.env.VITE_NORMAL_WEBHOOK || 'https://skymilo2.app.n8n.cloud/webhook-test/b9ab99b4-ccf9-43ca-a406-3b14c47362ec',
  ADVANCED_MODE: import.meta.env.VITE_ADVANCED_WEBHOOK || 'https://wonder3.app.n8n.cloud/webhook/ad30832c-1f6b-4293-8eec-85490817e62d',
} as const;

// Rate limiting store
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = userRequests.filter(timestamp => now - timestamp < 60000);
    
    if (recentRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    
    return true;
  }
  
  getRemainingRequests(userId: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    const recentRequests = userRequests.filter(timestamp => now - timestamp < 60000);
    
    return Math.max(0, SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE - recentRequests.length);
  }
}

export const rateLimiter = new RateLimiter();

// Security logger
class SecurityLogger {
  private logs: Array<{
    timestamp: Date;
    type: 'security_violation' | 'rate_limit' | 'suspicious_content' | 'validation_error';
    userId: string;
    message: string;
    data?: any;
  }> = [];
  
  log(type: 'security_violation' | 'rate_limit' | 'suspicious_content' | 'validation_error', userId: string, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date(),
      type,
      userId,
      message,
      data
    };
    
    this.logs.push(logEntry);
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn(`[SECURITY] ${type}:`, logEntry);
    }
  }
  
  getLogs() {
    return [...this.logs];
  }
  
  getLogsByType(type: string) {
    return this.logs.filter(log => log.type === type);
  }
}

export const securityLogger = new SecurityLogger();

// Input validation and sanitization for user input
export function validateAndSanitizeInput(input: string, userId: string): {
  isValid: boolean;
  sanitized: string;
  violations: string[];
} {
  const violations: string[] = [];
  let sanitized = input.trim();
  
  // Length validation
  if (sanitized.length < SECURITY_CONFIG.MIN_MESSAGE_LENGTH) {
    violations.push('Message too short');
  }
  
  if (sanitized.length > SECURITY_CONFIG.MAX_MESSAGE_LENGTH) {
    violations.push('Message too long');
    sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_MESSAGE_LENGTH);
  }
  
  // Check for forbidden patterns
  for (const pattern of SECURITY_CONFIG.FORBIDDEN_PATTERNS) {
    if (pattern.test(sanitized)) {
      violations.push('Forbidden content detected');
      securityLogger.log('security_violation', userId, 'Forbidden pattern detected', { pattern: pattern.source });
      // Remove the forbidden content
      sanitized = sanitized.replace(pattern, '[REMOVED]');
    }
  }
  
  // Check for suspicious patterns
  for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      violations.push('Suspicious content detected');
      securityLogger.log('suspicious_content', userId, 'Suspicious pattern detected', { pattern: pattern.source });
    }
  }
  
  // Basic HTML escape for user input only
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  const isValid = violations.length === 0;
  
  if (!isValid) {
    securityLogger.log('validation_error', userId, 'Input validation failed', { violations, originalLength: input.length });
  }
  
  return {
    isValid,
    sanitized,
    violations
  };
}

// Separate validation for AI responses (less aggressive sanitization)
export function validateAIResponse(response: string, userId: string): {
  isValid: boolean;
  sanitized: string;
  violations: string[];
} {
  const violations: string[] = [];
  let sanitized = response.trim();
  
  // Check for forbidden patterns (but don't HTML escape formatting)
  for (const pattern of SECURITY_CONFIG.FORBIDDEN_PATTERNS) {
    if (pattern.test(sanitized)) {
      violations.push('Forbidden content detected in AI response');
      securityLogger.log('security_violation', userId, 'Forbidden pattern in AI response', { pattern: pattern.source });
      sanitized = sanitized.replace(pattern, '[REMOVED]');
    }
  }
  
  const isValid = violations.length === 0;
  
  if (!isValid) {
    securityLogger.log('validation_error', userId, 'AI response validation failed', { violations });
  }
  
  return {
    isValid,
    sanitized,
    violations
  };
}

// HTML entity decoder for rendering messages
export function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

// Secure fetch wrapper with retry logic
export async function secureWebhookRequest(
  url: string, 
  data: any, 
  userId: string,
  retryCount: number = 0
): Promise<Response> {
  // Rate limiting check
  if (!rateLimiter.isAllowed(userId)) {
    securityLogger.log('rate_limit', userId, 'Rate limit exceeded');
    throw new Error(`Rate limit exceeded. Please wait before sending another message.`);
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SECURITY_CONFIG.WEBHOOK_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add timestamp for request tracking
        'X-Request-ID': `${userId}-${Date.now()}`,
        // Add client info (but not sensitive data)
        'X-Client-Info': 'BOCHK-AI-Client',
      },
      body: JSON.stringify({
        ...data,
        // Add security metadata
        security: {
          timestamp: new Date().toISOString(),
          requestId: `${userId}-${Date.now()}`,
          clientVersion: '1.0.0'
        }
      }),
      signal: controller.signal,
      mode: 'cors',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Retry logic for network errors
    if (retryCount < SECURITY_CONFIG.MAX_RETRIES && 
        (error instanceof TypeError || error.message.includes('fetch'))) {
      
      securityLogger.log('security_violation', userId, `Webhook request failed, retrying (${retryCount + 1}/${SECURITY_CONFIG.MAX_RETRIES})`, { error: error.message });
      
      // Exponential backoff
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return secureWebhookRequest(url, data, userId, retryCount + 1);
    }
    
    securityLogger.log('security_violation', userId, 'Webhook request failed after retries', { error: error.message });
    throw error;
  }
}

// Generate secure user ID
export function generateSecureUserId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `user_${timestamp}_${random}`;
}

// Content security policy headers (for documentation)
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Note: 'unsafe-inline' needed for React
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://wonder3.app.n8n.cloud",
    "font-src 'self'",
    "frame-ancestors 'none'"
  ].join('; ')
};

// Security validation for user roles
export function validateUserRole(userType: number): boolean {
  return userType >= 0 && userType <= 2 && Number.isInteger(userType);
}

// Secure error messages (don't expose internal details)
export function createSecureErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose detailed error messages in production
    if (import.meta.env.PROD) {
      return 'An error occurred. Please try again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred.';
}
