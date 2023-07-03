import { Order, Strategy, useGetUserStrategies } from 'libs/queries';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { createColumnHelper } from 'libs/table';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { FiatPriceDict } from 'store/useFiatCurrencyStore';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

export interface StrategyPortfolioData {
  token: Token;
  share: BigNumber;
  amount: BigNumber;
  value: BigNumber;
  strategies: Strategy[];
}

const columnHelper = createColumnHelper<StrategyPortfolioData>();

const tableColumns = [
  columnHelper.accessor('token.symbol', {
    header: 'Token',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('share', {
    header: 'Share',
    cell: (info) => info.getValue().toString(),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => info.getValue().toString(),
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    cell: (info) => info.getValue().toString(),
  }),
  columnHelper.accessor('strategies', {
    header: 'Strategies',
    cell: (info) => info.getValue().length,
  }),
];

export const useStrategyPortfolio = () => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const strategiesQuery = useGetUserStrategies();

  const uniqueTokens = useMemo(() => {
    const data = strategiesQuery.data;
    if (!data) return [];

    const tokens = new Set<string>();

    data.forEach((strategy) => {
      tokens.add(strategy.quote.address);
      tokens.add(strategy.base.address);
    });

    return Array.from(tokens);
  }, [strategiesQuery.data]);

  const tokenPriceQueries = useGetMultipleTokenPrices(uniqueTokens);

  const tokenPriceMap = useMemo(() => {
    const map = new Map<string, FiatPriceDict>();

    tokenPriceQueries.forEach((query, index) => {
      query.data && map.set(uniqueTokens[index], query.data);
    });

    return map;
  }, [tokenPriceQueries, uniqueTokens]);

  const totalValue = useMemo(() => {
    const data = strategiesQuery.data;
    if (!data) return new BigNumber(0);

    return data.reduce((acc, strategy) => {
      const fiatPriceDictQuote = tokenPriceMap.get(strategy.quote.address);
      const tokenPriceQuote = fiatPriceDictQuote?.[selectedFiatCurrency] || 0;

      const amountQuote = new BigNumber(strategy.order0.balance);
      const fiatAmountQuote = amountQuote.times(tokenPriceQuote);

      const fiatPriceDictBase = tokenPriceMap.get(strategy.base.address);
      const tokenPriceBase = fiatPriceDictBase?.[selectedFiatCurrency] || 0;

      const amountBase = new BigNumber(strategy.order1.balance);
      const fiatAmountBase = amountBase.times(tokenPriceBase);

      const fiatAmount = fiatAmountQuote.plus(fiatAmountBase);
      return acc.plus(fiatAmount);
    }, new BigNumber(0));
  }, [selectedFiatCurrency, strategiesQuery.data, tokenPriceMap]);

  const tableData: StrategyPortfolioData[] = useMemo(() => {
    const data = strategiesQuery.data;
    if (!data) return [];

    return data.reduce(
      ((map) => (acc: StrategyPortfolioData[], strategy) => {
        const handleData = (token: Token, order: Order) => {
          const fiatPriceDict = tokenPriceMap.get(token.address);
          const tokenPrice = fiatPriceDict?.[selectedFiatCurrency] || 0;

          const amount = new BigNumber(order.balance);

          let item = map.get(token.symbol);

          if (!item) {
            const value = amount.times(tokenPrice);
            const share = value.dividedBy(totalValue).times(100);

            item = {
              token,
              share,
              amount,
              value,
              strategies: [strategy],
            };

            map.set(token.symbol, item);
            acc.push(item);
          } else {
            item.share = item.share.plus(
              amount.times(tokenPrice).dividedBy(totalValue).times(100)
            );
            item.amount = item.amount.plus(order.balance);
            item.value = item.value.plus(amount.times(tokenPrice));
            item.strategies.push(strategy);
          }
        };

        handleData(strategy.quote, strategy.order0);
        handleData(strategy.base, strategy.order1);

        return acc;
      })(new Map<string, StrategyPortfolioData>()),
      []
    );
  }, [selectedFiatCurrency, strategiesQuery.data, tokenPriceMap, totalValue]);

  return { tableData, tableColumns, totalValue };
};
