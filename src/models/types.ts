export enum ErrorType {
  VALIDATION_ERROR = "ValidationError",
  UNAUTHORIZED = "Unauthorized",
  NOT_FOUND = "NotFound",
  INTERNAL_ERROR = "InternalError",
}

export interface SharePointContext {
  // Product info
  productId: string;
  productName: string;

  // Site info
  portalUrl?: string;
  absoluteUrl?: string;

  // Tenant info
  tenantDisplayName?: string;
  aadTenantId: string;

  // User info
  aadUserId?: string;
  userEmail: string;
  userDisplayName?: string;
  userPrincipalName?: string;

  // Usage tracking
  installedDateTime?: Date;
  lastUsedDateTime?: Date;
}

export interface UserContextEntity extends SharePointContext {
  partitionKey: string;
  rowKey: string;
}

export interface UserContextQueryParams {
  select?: string;
  top?: number;
  filter?: string;
  orderBy?: string;
  search?: string;
}
