import { TransactionStatus, TransactionType } from "@prisma/client";

export interface WithdrawalRequest {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    ifscCode: string;
  };
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  timestamp: Date;
  transactionId: string;
  description?: string;
  metadata?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolder: string;
    remarks?: string;
  };
}