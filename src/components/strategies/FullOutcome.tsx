import { Token } from 'libs/tokens';
import { FC, useMemo } from 'react';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { AcquireAmountProps, getAcquiredAmount } from 'utils/fullOutcome';
import { cn } from 'utils/helpers';

interface FullOutcomeProps extends AcquireAmountProps {
  base: Token;
  quote: Token;
  className?: string;
}

const roundTokenAmount = (amount: string, token: Token) => {
  const value = new Intl.NumberFormat('en-US').format(Number(amount));
  return `${value} ${token.symbol}`;
};

const tokenAmount = (amount: string, token: Token) => {
  const value = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: token.decimals,
  }).format(Number(amount));
  return `${value} ${token.symbol}`;
};

export const FullOutcomeCreateStrategy: FC<FullOutcomeProps> = (props) => {
  const result = useMemo(() => getAcquiredAmount(props), [props]);
  if (!result) return <></>;
  const { amount, mean } = result;
  const targetToken = props.buy ? props.base : props.quote;
  return (
    <p className={cn('text-start text-12 text-white/60', props.className)}>
      If the order is 100% filled, you will receive.&nbsp;
      <b title={tokenAmount(amount, targetToken)}>
        {roundTokenAmount(amount, targetToken)}
      </b>
      &nbsp;at an average price of&nbsp;
      <b title={tokenAmount(mean, props.quote)}>
        {roundTokenAmount(mean, props.quote)}
      </b>
      &nbsp;per <b>1 {props.base.symbol}</b>.&nbsp;
      <a
        href="/"
        target="_blank"
        className="inline-flex items-center gap-4 text-green underline"
      >
        <span>Learn More</span>
        <IconLink className="inline h-12 w-12" />
      </a>
    </p>
  );
};
