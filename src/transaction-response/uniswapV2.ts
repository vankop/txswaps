import { Contract } from 'ethers';
import v2RouterArtifact from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import type { TransactionResponse } from 'ethers';
import type { Logger, TransactionDataSwap } from '../types';

const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const ROUTER_2 = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const routerV2Contract = new Contract(ROUTER_2, v2RouterArtifact.abi);

function swapETHForExactTokens(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapETHForExactTokens',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: WETH_ADDRESS,
    tokenOut: args.path[args.path.length - 1],
    amountIn: transaction.value,
    amountOut: args.amountOut,
    mode: 'in',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapExactETHForTokens(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapExactETHForTokens',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: WETH_ADDRESS,
    tokenOut: args.path[args.path.length - 1],
    amountIn: transaction.value,
    amountOut: args.amountOutMin,
    mode: 'out',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapExactETHForTokensSupportingFeeOnTransferTokens(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapExactETHForTokensSupportingFeeOnTransferTokens',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: WETH_ADDRESS,
    tokenOut: args.path[args.path.length - 1],
    amountIn: transaction.value,
    amountOut: args.amountOutMin,
    mode: 'out',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapExactTokensForETH(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapExactTokensForETH',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: args.path[0],
    tokenOut: WETH_ADDRESS,
    amountIn: args.amountIn,
    amountOut: args.amountOutMin,
    mode: 'out',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapExactTokensForETHSupportingFeeOnTransferTokens(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapExactTokensForETHSupportingFeeOnTransferTokens',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: args.path[0],
    tokenOut: WETH_ADDRESS,
    amountIn: args.amountIn,
    amountOut: args.amountOutMin,
    mode: 'out',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapExactTokensForTokens(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapExactTokensForTokens',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: args.path[0],
    tokenOut: args.path[args.path.length - 1],
    amountIn: args.amountIn,
    amountOut: args.amountOutMin,
    mode: 'out',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapExactTokensForTokensSupportingFeeOnTransferTokens(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapExactTokensForTokensSupportingFeeOnTransferTokens',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: args.path[0],
    tokenOut: args.path[args.path.length - 1],
    amountIn: args.amountIn,
    amountOut: args.amountOutMin,
    mode: 'out',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapTokensForExactETH(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapTokensForExactETH',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: args.path[0],
    tokenOut: WETH_ADDRESS,
    amountIn: args.amountInMax,
    amountOut: args.amountOut,
    mode: 'in',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

function swapTokensForExactTokens(
  transaction: TransactionResponse
): TransactionDataSwap | undefined {
  const args = routerV2Contract.interface.decodeFunctionData(
    'swapTokensForExactTokens',
    transaction.data
  );
  if (args.path.length === 0) return;
  return {
    wallet: transaction.from,
    tokenIn: args.path[0],
    tokenOut: args.path[args.path.length - 1],
    amountIn: args.amountInMax,
    amountOut: args.amountOut,
    mode: 'in',
    path: args.path,
    protocol: 'uniswapv2'
  };
}

export function parseTransaction(
  transaction: TransactionResponse,
  logger?: Logger
): TransactionDataSwap | undefined {
  const d = transaction.data.slice(2);
  try {
    if (d.startsWith('b6f9de95'))
      return swapExactETHForTokensSupportingFeeOnTransferTokens(transaction);
    if (d.startsWith('791ac947'))
      return swapExactTokensForETHSupportingFeeOnTransferTokens(transaction);
    if (d.startsWith('7ff36ab5')) return swapExactETHForTokens(transaction);
    if (d.startsWith('18cbafe5')) return swapExactTokensForETH(transaction);
    if (d.startsWith('4a25d94a')) return swapTokensForExactETH(transaction);
    if (d.startsWith('fb3bdb41')) return swapETHForExactTokens(transaction);
    if (d.startsWith('5c11d795'))
      return swapExactTokensForTokensSupportingFeeOnTransferTokens(transaction);
    if (d.startsWith('38ed1739')) return swapExactTokensForTokens(transaction);
    if (d.startsWith('8803dbee')) return swapTokensForExactTokens(transaction);
  } catch {
    logger?.error(`txhash=${transaction.hash}`, 'parsing raw data failed');
    return;
  }
  logger?.debug(
    `txhash=${transaction.hash}`,
    'unhandled uniswap v2 router call'
  );
}
