import {
    DashboardFilters,
    getDashboardFilterRulesForTile,
} from '@lightdash/common';
import { useMemo } from 'react';
import { useDashboardContext } from '../../providers/DashboardProvider';

const useDashboardFiltersForTile = (tileUuid: string): DashboardFilters => {
    const { dashboardFilters, dashboardTemporaryFilters } =
        useDashboardContext();

    return useMemo(
        () => ({
            dimensions: getDashboardFilterRulesForTile(tileUuid, [
                ...dashboardFilters.dimensions,
                ...(dashboardTemporaryFilters?.dimensions ?? []),
            ]),
            metrics: getDashboardFilterRulesForTile(tileUuid, [
                ...dashboardFilters.metrics,
                ...(dashboardTemporaryFilters?.metrics ?? []),
            ]),
        }),
        [tileUuid, dashboardFilters, dashboardTemporaryFilters],
    );
};

export default useDashboardFiltersForTile;