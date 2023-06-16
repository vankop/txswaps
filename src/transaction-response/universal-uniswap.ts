import { TransactionResponse, AbiCoder, Contract, getAddress } from 'ethers';
import universalRouterAbi from '../abi/universal-router.json';
import { Logger, TransactionSwapData } from '../types';

const UNIVERSAL_ROUTER_ADDRESS = '0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B';
const universalRouterContract = new Contract(
  UNIVERSAL_ROUTER_ADDRESS,
  universalRouterAbi
);

enum SwapType {
  V3_SWAP_EXACT_IN,
  V3_SWAP_EXACT_OUT,
  V2_SWAP_EXACT_IN,
  V2_SWAP_EXACT_OUT
}

const swapCodes: Record<string, SwapType> = {
  '00': SwapType.V3_SWAP_EXACT_IN,
  '01': SwapType.V3_SWAP_EXACT_OUT,
  '08': SwapType.V2_SWAP_EXACT_IN,
  '09': SwapType.V2_SWAP_EXACT_OUT
};
const swapSet = new Set(Object.keys(swapCodes));

function extractPathFromV3(fullPath: string) {
  const fullPathWithoutHexSymbol = fullPath.substring(2);
  let path = [];
  let currentAddress = '';
  for (let i = 0; i < fullPathWithoutHexSymbol.length; i++) {
    currentAddress += fullPathWithoutHexSymbol[i];
    if (currentAddress.length === 40) {
      path.push('0x' + currentAddress);
      i = i + 6;
      currentAddress = '';
    }
  }
  return path;
}

export function parseTransaction(
  transaction: TransactionResponse,
  logger?: Logger
): TransactionSwapData | undefined {
  if (!transaction.to) return;
  let commands: string;
  let inputs: string[];
  if (transaction.data.startsWith('0x3593564c')) {
    const result = universalRouterContract.interface.decodeFunctionData(
      'execute(bytes,bytes[],uint256)',
      transaction.data
    );
    commands = result.commands;
    inputs = result.inputs;
  } else if (transaction.data.startsWith('0x24856bc3')) {
    const result = universalRouterContract.interface.decodeFunctionData(
      'execute(bytes,bytes[])',
      transaction.data
    );
    commands = result.commands;
    inputs = result.inputs;
  } else {
    logger?.debug(
      `txhash=${transaction.hash}`,
      'unhandled universal uniswap router call'
    );
    return;
  }
  const commandsSplit = commands!.substring(2).match(/.{1,2}/g);
  if (!commandsSplit) {
    logger?.debug(
      `txhash=${transaction.hash}`,
      'unhandled universal uniswap router call'
    );
    return;
  }

  const abiCoder = AbiCoder.defaultAbiCoder();

  let foundFunction: SwapType | undefined;
  let input: string | undefined;
  commandsSplit.forEach((commandCode: string, i: number) => {
    if (!swapSet.has(commandCode)) return;
    foundFunction = swapCodes[commandCode];
    input = inputs![i];
  });

  if (foundFunction === undefined || input === undefined) return;

  switch (foundFunction) {
    case SwapType.V3_SWAP_EXACT_IN: {
      const [, amountIn, amountOut, bytesPath] = abiCoder.decode(
        ['address', 'uint256', 'uint256', 'bytes', 'bool'],
        input
      );
      const path = extractPathFromV3(bytesPath);
      return {
        wallet: transaction.from,
        tokenIn: getAddress(path[0]),
        tokenOut: getAddress(path[path.length - 1]),
        amountIn: amountIn,
        amountOut: amountOut,
        mode: 'out',
        path,
        protocol: 'uniswapv3'
      };
    }
    case SwapType.V3_SWAP_EXACT_OUT: {
      const [, amountOut, amountIn, bytesPath] = abiCoder.decode(
        ['address', 'uint256', 'uint256', 'bytes', 'bool'],
        input
      );
      const path = extractPathFromV3(bytesPath);
      return {
        wallet: transaction.from,
        tokenIn: getAddress(path[path.length - 1]),
        tokenOut: getAddress(path[0]),
        amountIn: amountIn,
        amountOut: amountOut,
        mode: 'in',
        path: path.reverse(),
        protocol: 'uniswapv3'
      };
    }
    case SwapType.V2_SWAP_EXACT_IN: {
      const [, amountIn, amountOut, path] = abiCoder.decode(
        ['address', 'uint256', 'uint256', 'address[]', 'bool'],
        input
      );
      return {
        wallet: transaction.from,
        tokenIn: getAddress(path[0]),
        tokenOut: getAddress(path[path.length - 1]),
        amountIn: amountIn,
        amountOut: amountOut,
        mode: 'out',
        path,
        protocol: 'uniswapv2'
      };
    }
    case SwapType.V2_SWAP_EXACT_OUT: {
      const [, amountOut, amountIn, path] = abiCoder.decode(
        ['address', 'uint256', 'uint256', 'address[]', 'bool'],
        input
      );
      return {
        wallet: transaction.from,
        tokenIn: getAddress(path[path.length - 1]),
        tokenOut: getAddress(path[0]),
        amountIn: amountIn,
        amountOut: amountOut,
        mode: 'out',
        path: path.reverse(),
        protocol: 'uniswapv2'
      };
    }
    default:
      return;
  }
}
