import { parseEther } from 'ethers';
import type { TransactionReceipt, TransactionResponse } from 'ethers';
import { TransactionSwap } from '../src/types';
import { findSwapInTransactionReceipt } from '../src/transaction-receipt/uniswap';
import fixture0 from './fixtures/0xf24d55cb97389fed04dbadd98227a782c557466ee073d5da43c2c122842eb49c.json';
import fixture1 from './fixtures/0x59b82259f1211c3a02cd2c42805544e9aed0aac1e0a12b78bf6fa14939a94cd3.json';
import fixture2 from './fixtures/0x2ae835ac525e51e7895839ac8c8e8f160361de6c308ad567ef4c023bdc32aa99.json';
import fixture3 from './fixtures/0xaf37e501f5c4e8c19a346785f79b2e0c9977d781120c89960b2eb7c5b50050cf.json';
import fixture4 from './fixtures/0x400342224488519eaadc4a01ff03868f1c263b4797fa3746721ea9eca732f932.json';
import fixture5 from './fixtures/0x4b80fb07b0bdeecb6546cff91a570913b4e3b640f84d2bed3ccea2b7a8c84299.json';
// swapExactTokensForETHSupportingFeeOnTransferTokens uniswapV2
import fixture6 from './fixtures/0xc0cb410db3a7dcc612b49d43ab8e5b5a3caa0cb9be3a83546ad288037803450f.json';
// DAI <-> USDC
import fixture7 from './fixtures/0xa91fa21893a99ca5c46eb900f6c37aff33f3ecae98b4be14a2a80bbaa21a3e2c.json';

const ROUTERS = new Set([
  '0x881D40237659C251811CEC9c364ef91dC08D300C', // metamask swap router
  '0x03f34bE1BF910116595dB1b11E9d1B2cA5D59659',
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  '0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B',
  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
]);

const testCases: [any, TransactionSwap][] = [
  [
    fixture0,
    {
      wallet: '0x21fD08A5DD27Ae6c1f4550F7c1114aCe78A837bf',
      tokenIn: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      tokenOut: ['0x9F94b198ce85C19A846C2B1a4D523f40A747a850'],
      amountIn: [parseEther('0.5')],
      amountOut: [297566863821766819n]
    }
  ],
  [
    fixture1,
    {
      wallet: '0xB8Bd911aA8fa479758275Bab75d4E0eb91Ed7408',
      tokenIn: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      tokenOut: ['0x8dA0e5B872aECc1D53633f540AE49A51D59007c9'],
      amountIn: [parseEther('0.2')],
      amountOut: [5918994519836514285924n]
    }
  ],
  [
    fixture2,
    {
      wallet: '0x8a7fA647785B0F6A62f9965435c768673b0c41F9',
      tokenIn: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      tokenOut: ['0x6ab0fcB082e93a2fB84336197cEFF2832D1AeFcF'],
      amountIn: [parseEther('0.25')],
      amountOut: [3417417930736329797n]
    }
  ],
  [
    fixture3,
    {
      wallet: '0x8a7fA647785B0F6A62f9965435c768673b0c41F9',
      tokenIn: ['0x25127685dC35d4dc96C7fEAC7370749d004C5040'],
      tokenOut: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      amountIn: [1000000000000000000000n],
      amountOut: [6886750042271290394n]
    }
  ],
  [
    fixture4,
    {
      wallet: '0xAFee7Feed42F828F2ac6003AB13d93EC5f8Db7be',
      tokenIn: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      tokenOut: ['0x7CA5af5bA3472AF6049F63c1AbC324475D44EFC1'],
      amountIn: [parseEther('0.065')],
      amountOut: [50301815289362n]
    }
  ],
  [
    fixture5,
    {
      wallet: '0x6ee19d6fc1a778f85146F3D8A9CF4f6052610C9E',
      tokenIn: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      tokenOut: ['0x1d9eCEC86e216141356145cb06abC6759A0871C7'],
      amountIn: [parseEther('0.03')],
      amountOut: [12482546076258308n]
    }
  ],
  [
    fixture6,
    {
      wallet: '0x8a7fA647785B0F6A62f9965435c768673b0c41F9',
      tokenIn: ['0xefe243F87FEB8AcFF400be80b3A61c0C8178d014'],
      tokenOut: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      amountIn: [10302986693139n],
      amountOut: [450922624186059686n]
    }
  ],
  [
    fixture7,
    {
      wallet: '0x6232a1101E746F009830ff97E30DaBf49fF2829C',
      tokenOut: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
      tokenIn: ['0x6B175474E89094C44Da98b954EedeAC495271d0F'],
      amountIn: [301000000000000000000n],
      amountOut: [300986292n]
    }
  ]
];

testCases.forEach((tx) => {
  it(`tx: ${tx[0].transaction.hash}`, () => {
    tx[0].transaction.value = BigInt(tx[0].transaction.value);
    const swap = findSwapInTransactionReceipt(
      tx[0].transaction as unknown as TransactionResponse,
      tx[0].receipt.logs as unknown as TransactionReceipt,
      ROUTERS
    );
    expect(swap).toEqual(tx[1]);
  });
});
