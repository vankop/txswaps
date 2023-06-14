import { AbiCoder, zeroPadValue } from 'ethers';
import type { TransactionReceipt, TransactionResponse } from 'ethers';
import type { Logger, TransactionSwap } from '../types';

const TRANSFER_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const abiCoder = AbiCoder.defaultAbiCoder();

function getAmount(data: string): bigint {
  return abiCoder.decode(['uint256'], data)[0];
}

export function findSwapInTransactionReceipt(
  transaction: TransactionResponse,
  receipt: TransactionReceipt,
  routersAddresses: Set<string>,
  logger?: Logger
): TransactionSwap | null {
  if (!transaction.to) return null;
  if (routersAddresses.has(transaction.to)) {
    const inOut = new Map<string, { in: bigint; out: bigint }>();
    const routerAddress = zeroPadValue(transaction.to, 32);
    const wallet = zeroPadValue(transaction.from, 32);
    if (transaction.value > 0n)
      inOut.set(WETH_ADDRESS, { in: transaction.value, out: 0n });
    for (const log of receipt) {
      if (log.topics[0] !== TRANSFER_TOPIC) continue;
      debugger;
      if (log.topics[1] === wallet) {
        // from wallet
        let entry = inOut.get(log.address);
        if (!entry) {
          entry = { in: 0n, out: 0n };
          inOut.set(log.address, entry);
        }
        entry.in += getAmount(log.data);
      } else if (log.topics[2] === wallet) {
        // to address
        let entry = inOut.get(log.address);
        if (!entry) {
          entry = { in: 0n, out: 0n };
          inOut.set(log.address, entry);
        }
        entry.out += getAmount(log.data);
      } else if (
        log.topics[1] !== log.topics[2] &&
        log.topics[2] === routerAddress &&
        log.address === WETH_ADDRESS
      ) {
        // transfer WETH to router. it happens only after swap to unwrap and safeTransferETH to recipient
        let entry = inOut.get(WETH_ADDRESS);
        if (!entry) {
          entry = { in: 0n, out: 0n };
          inOut.set(log.address, entry);
        }
        entry.out += getAmount(log.data);
      }
    }

    logger?.trace(
      `txhash=${transaction.hash}`,
      `found ${inOut.size} tokens transfers`
    );

    if (inOut.size === 0) return null;

    const swap: TransactionSwap = {
      wallet: transaction.from,
      tokenIn: [],
      tokenOut: [],
      amountIn: [],
      amountOut: []
    };

    debugger;
    for (const [key, value] of inOut) {
      if (value.out > value.in) {
        swap.tokenOut.push(key);
        swap.amountOut.push(value.out - value.in);
      } else {
        swap.tokenIn.push(key);
        swap.amountIn.push(value.in - value.out);
      }
    }
    return swap;
  }

  return null;
}
