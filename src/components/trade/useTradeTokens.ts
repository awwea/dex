import {
  PathNames,
  useSearch,
  useRouterState,
  useNavigate,
} from 'libs/routing';
import { useTokens } from 'hooks/useTokens';

export const useTradeTokens = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const isTradePage = location.pathname === PathNames.trade;
  const { getTokenById } = useTokens();
  const search = useSearch({ from: '/trade' });

  const baseToken = getTokenById(search.base);
  const quoteToken = getTokenById(search.quote);

  const goToPair = (base: string, quote: string, replace?: boolean) =>
    navigate({ to: '/trade', search: { base, quote }, replace });

  const isTokenError =
    (search.base && !baseToken) || (search.base && !quoteToken);

  return {
    isTradePage,
    baseToken,
    quoteToken,
    isTokenError,
    goToPair,
  };
};
