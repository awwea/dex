import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { FC, useId } from 'react';
import { StrategyType } from '../types';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useStrategyEvents } from './useStrategyEvents';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

interface Props {
  base: Token;
  quote: Token;
  order: OrderCreate;
  strategyType?: StrategyType;
  tokenBalanceQuery: UseQueryResult<string>;
  isBudgetOptional?: boolean;
  buy?: boolean;
}

export const BudgetSection: FC<Props> = ({
  buy,
  quote,
  base,
  strategyType,
  order,
  isBudgetOptional,
  tokenBalanceQuery,
}) => {
  const inputId = useId();
  const budgetToken = buy ? quote : base;
  const insufficientBalance =
    !tokenBalanceQuery.isLoading &&
    new BigNumber(tokenBalanceQuery.data || 0).lt(order.budget);

  useStrategyEvents({ base, quote, order, buy, insufficientBalance });

  return (
    <fieldset className="flex flex-col gap-8">
      <legend
        className={`mb-11 flex items-center gap-6 text-14 font-weight-500 text-white/60`}
      >
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px]`}
        >
          2
        </span>
        <Tooltip
          sendEventOnMount={{ buy }}
          element={
            buy
              ? `The amount of ${
                  quote.symbol
                } tokens you would like to use in order to buy ${
                  base.symbol
                }. ${
                  strategyType === 'recurring'
                    ? 'Note: this amount will re-fill once the "Sell" order is used by traders.'
                    : ''
                }`
              : `The amount of ${base.symbol} tokens you would like to sell. ${
                  strategyType === 'recurring'
                    ? 'Note: this amount will re-fill once the "Buy" order is used by traders.'
                    : ''
                }`
          }
        >
          <div className={'font-weight-500 text-white/60'}>
            Set {buy ? 'Buy' : 'Sell'} Budget{' '}
          </div>
        </Tooltip>
        {isBudgetOptional && (
          <div className="ml-8 font-weight-500 text-white/40">Optional</div>
        )}
      </legend>
      <TokenInputField
        id={inputId}
        className={'rounded-16 bg-black p-16'}
        value={order.budget}
        setValue={order.setBudget}
        token={budgetToken}
        isBalanceLoading={tokenBalanceQuery.isLoading}
        balance={tokenBalanceQuery.data}
        isError={insufficientBalance}
      />
      {insufficientBalance && (
        <output
          htmlFor={inputId}
          role="alert"
          aria-live="polite"
          className={`flex items-center gap-10 font-mono text-12 text-red`}
        >
          <IconWarning className="h-12 w-12" />
          <span>Insufficient balance</span>
        </output>
      )}
    </fieldset>
  );
};
