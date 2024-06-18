import { Page } from 'components/common/page';
import { Outlet, Navigate, useNavigate } from 'libs/routing';
import {
  ExplorerSearch,
  useExplorer,
  useExplorerParams,
} from 'components/explorer';
import { StrategyProvider, useStrategyCtx } from 'hooks/useStrategies';
import { ExplorerTabs } from 'components/explorer/ExplorerTabs';
import { useEffect, useState } from 'react';
import { explorerEvents } from 'services/events/explorerEvents';
import { toPairSlug } from 'utils/pairSearch';
import config from 'config';

export const ExplorerPage = () => {
  const { slug, type } = useExplorerParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug || type === 'wallet') return;
    const defaultSlug = toPairSlug(
      { address: config.defaultTokenPair[0] },
      { address: config.defaultTokenPair[1] }
    );

    navigate({
      to: '/explore/$type/$slug',
      params: { type, slug: defaultSlug },
      replace: true,
    });
  }, [slug, navigate, type]);

  const query = useExplorer();
  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to="/explore/$type" params={{ type: 'token-pair' }} />;
  }

  return (
    <Page hideTitle>
      <StrategyProvider query={query}>
        <ExplorerEvents />
        <div className="space-y-30 flex flex-grow flex-col">
          <ExplorerSearch />
          {slug && <ExplorerTabs />}
          <Outlet />
        </div>
      </StrategyProvider>
    </Page>
  );
};

const ExplorerEvents = () => {
  const [mounted, setMounted] = useState(false);
  const { slug, type } = useExplorerParams();
  const { strategies, isLoading, filter, sort } = useStrategyCtx();

  useEffect(() => {
    if (!mounted) return;
    explorerEvents.typeChange(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (!slug || isLoading) return;
    explorerEvents.search({ type, slug, strategies, filter, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isLoading]);

  useEffect(() => {
    if (!mounted || !slug) return;
    explorerEvents.resultsFilter({ type, slug, strategies, filter, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (!mounted || !slug) return;
    explorerEvents.resultsSort({ type, slug, strategies, filter, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // This ensure all useEffect have been triggered once before setting mounted to true
  useEffect(() => setMounted(true), [setMounted]);
  return <></>;
};
