import type { AuditType } from "./enums";

export interface IAuditLog {
  id: number;
  type: AuditType;
  action: string;
  entityType: string;
  entityId: number;
  newValue: string;
  internal: boolean;
  changedAt: string;
  changedBy: string;
}
