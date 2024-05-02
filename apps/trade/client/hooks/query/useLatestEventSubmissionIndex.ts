import { useQuery } from '@tanstack/react-query';
import { toBigDecimal } from '@vertex-protocol/client';
import {
  PrimaryChainID,
  usePrimaryChainId,
  useVertexClient,
} from '@vertex-protocol/web-data';

import { QueryDisabledError } from 'client/hooks/query/QueryDisabledError';
import { first } from 'lodash';

function latestEventSubmissionIndexQueryKey(chainId: PrimaryChainID) {
  return ['latestEventSubmissionIndex', chainId];
}

export function useLatestEventSubmissionIndex() {
  const primaryChainId = usePrimaryChainId();
  const vertexClient = useVertexClient();
  const disabled = !vertexClient;

  return useQuery({
    queryKey: latestEventSubmissionIndexQueryKey(primaryChainId),
    queryFn: async () => {
      if (disabled) {
        throw new QueryDisabledError();
      }
      const events = await vertexClient.context.indexerClient.getEvents({
        limit: {
          type: 'txs',
          value: 1,
        },
        desc: true,
      });

      const latestEvent = first(events);

      if (!latestEvent) {
        console.error('Error fetching latest event', latestEvent);
        throw new Error('Error fetching latest event');
      }

      return toBigDecimal(latestEvent.submissionIndex);
    },
    enabled: !disabled,
    refetchInterval: 10000,
  });
}
