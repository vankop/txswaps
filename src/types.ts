export interface Logger {
  trace(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface TransactionSwapData {
  wallet: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
  amountOut: bigint;
  // in Swap for a maximum amount of input tokens
  // out Swap for a minimum amount of output tokens
  mode: 'in' | 'out';
  protocol: 'uniswapv2' | 'uniswapv3';
  path: string[];
}

export interface TransactionSwap {
  wallet: string;
  tokenIn: string[];
  tokenOut: string[];
  amountIn: bigint[];
  amountOut: bigint[];
}
