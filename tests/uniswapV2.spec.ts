import { parseTransaction } from '../src/transaction-response/uniswapV2';
import type { TransactionResponse } from 'ethers';
import type { TransactionDataSwap } from '../src/types';

const txs: TransactionResponse[] = [
  {
    data: '0xb6f9de95000000000000000000000000000000000000000000000000007405769a196e3c000000000000000000000000000000000000000000000000000000000000008000000000000000000000000021fd08a5dd27ae6c1f4550f7c1114ace78a837bf00000000000000000000000000000000000000000000000000000000647f8d780000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000009f94b198ce85c19a846c2b1a4d523f40a747a850',
    hash: '0xf24d55cb97389fed04dbadd98227a782c557466ee073d5da43c2c122842eb49c',
    from: '0x21fD08A5DD27Ae6c1f4550F7c1114aCe78A837bf',
    gasLimit: 1n,
    gasPrice: 1n,
    value: 500000000000000000n
  } as any
];

const expected: Partial<TransactionDataSwap>[] = [
  {
    wallet: '0x21fD08A5DD27Ae6c1f4550F7c1114aCe78A837bf',
    tokenIn: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tokenOut: '0x9F94b198ce85C19A846C2B1a4D523f40A747a850',
    amountIn: 500000000000000000n,
    amountOut: 32657104248073788n,
    mode: 'out'
  }
];

for (let i = 0; i < txs.length; i++) {
  it(`tx: ${txs[i].hash}`, () => {
    const swap = parseTransaction(txs[i]);
    // @ts-expect-error
    swap.path = undefined;
    // @ts-expect-error
    swap.protocol = undefined;
    expect(swap).toEqual(expected[i]);
  });
}
