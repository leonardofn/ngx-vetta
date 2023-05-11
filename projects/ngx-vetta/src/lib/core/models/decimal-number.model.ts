import { DecimalSeparator } from '../types/decimal-separator.type';

export interface DecimalNumberOptions {
  maxIntegers?: number;
  maxDecimals?: number;
  allowNegative?: boolean;
  decimalSeparator?: DecimalSeparator;
  enableMask?: boolean;
}
