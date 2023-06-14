import { TransactionResponse } from 'ethers';
import { parseTransaction as parseTransactionForUniversalUniswapRouter } from './universal-uniswap';
import { parseTransaction as parseTransactionForUniswapV2Router } from './uniswapV2';
import { Logger, TransactionSwapData } from '../types';

export function findSwapInTransactionResponse(
  transaction: TransactionResponse,
  v2RoutersAddresses: Set<string>,
  universalRoutersAddresses: Set<string>,
  logger?: Logger
): TransactionSwapData | undefined | null {
  if (!transaction.to) return;
  if (v2RoutersAddresses.has(transaction.to)) {
    return parseTransactionForUniswapV2Router(transaction, logger);
  }
  if (universalRoutersAddresses.has(transaction.to)) {
    return parseTransactionForUniversalUniswapRouter(transaction, logger);
  }
  logger?.debug(
    `txhash=${transaction.hash}`,
    `Unknown destination ${transaction.to}`
  );
}
