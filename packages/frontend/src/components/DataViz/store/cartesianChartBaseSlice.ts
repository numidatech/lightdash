// This is explicit to exploring
// Not needed when viewing a cartesian chart on a dashboard
import {
    ChartKind,
    isFormat,
    VIZ_DEFAULT_AGGREGATION,
    type CartesianChartDisplay,
    type PivotChartLayout,
    type VizAggregationOptions,
    type VizCartesianChartConfig,
    type VizCartesianChartOptions,
    type VizConfigErrors,
} from '@lightdash/common';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type CartesianChartState = {
    metadata: {
        version: number;
    };
    type: ChartKind;
    fieldConfig: VizCartesianChartConfig['fieldConfig'] | undefined;
    display: VizCartesianChartConfig['display'] | undefined;
    options: VizCartesianChartOptions;
    errors: VizConfigErrors | undefined;
};

const initialState: CartesianChartState = {
    metadata: {
        version: 1,
    },
    type: ChartKind.VERTICAL_BAR,
    fieldConfig: undefined,
    display: undefined,
    options: {
        indexLayoutOptions: [],
        valuesLayoutOptions: { preAggregated: [], customAggregations: [] },
        pivotLayoutOptions: [],
    },
    errors: undefined,
};

export const cartesianChartConfigSlice = createSlice({
    name: 'cartesianChartBaseConfig',
    initialState,
    reducers: {
        setXAxisReference: (state, action: PayloadAction<string>) => {
            const xField = state.options.indexLayoutOptions.find(
                (x) => x.reference === action.payload,
            );

            // NOTE: now setting a field instead of just a reference.
            if (state.fieldConfig && xField) {
                state.fieldConfig.x = {
                    type: xField.axisType,
                    reference: xField.reference,
                };
            }
        },

        setGroupByReference: (
            { fieldConfig },
            action: PayloadAction<{
                reference: string;
            }>,
        ) => {
            if (fieldConfig) {
                fieldConfig.groupBy = [{ reference: action.payload.reference }];
            }
        },

        // Setter
        unsetGroupByReference: ({ fieldConfig }) => {
            if (fieldConfig) {
                fieldConfig.groupBy = undefined;
            }
        },

        // TODO: has logic for default aggregation but it shouldn't
        setYAxisReference: (
            state,
            action: PayloadAction<{
                reference: string;
                index: number;
            }>,
        ) => {
            if (state.fieldConfig?.y) {
                const yAxis = state.fieldConfig.y[action.payload.index];

                let matchingOption =
                    state.options.valuesLayoutOptions.preAggregated.find(
                        (option) =>
                            option.reference === action.payload.reference,
                    ) ??
                    state.options.valuesLayoutOptions.customAggregations.find(
                        (option) =>
                            option.reference === action.payload.reference,
                    );

                if (yAxis) {
                    yAxis.reference = action.payload.reference;
                    yAxis.aggregation =
                        matchingOption?.aggregationOptions?.[0] ??
                        VIZ_DEFAULT_AGGREGATION;
                } else {
                    state.fieldConfig.y.push({
                        reference: action.payload.reference,
                        aggregation:
                            matchingOption?.aggregationOptions?.[0] ??
                            VIZ_DEFAULT_AGGREGATION,
                    });
                }
            }
        },

        setYAxisAggregation: (
            { fieldConfig },
            action: PayloadAction<{
                index: number;
                aggregation: VizAggregationOptions;
            }>,
        ) => {
            if (!fieldConfig) return;
            if (!fieldConfig?.y) return;

            const yAxis = fieldConfig.y[action.payload.index];
            if (yAxis) {
                yAxis.aggregation = action.payload.aggregation;
            }
        },

        setXAxisLabel: (
            { display },
            action: PayloadAction<
                Pick<Required<CartesianChartDisplay>['xAxis'], 'label'>
            >,
        ) => {
            if (!display) display = {};
            if (!display.xAxis) display.xAxis = {};
            display.xAxis.label = action.payload.label;
        },

        setYAxisLabel: (
            { display },
            action: PayloadAction<{ index: number; label: string }>,
        ) => {
            if (!display) display = {};

            display.yAxis = display.yAxis || [];
            display.yAxis = display.yAxis || [];

            const { index, label } = action.payload;
            if (display.yAxis[index] === undefined) {
                display.yAxis[index] = {
                    label,
                };
            } else {
                display.yAxis[index].label = label;
            }
        },

        setSeriesLabel: (
            { display },
            action: PayloadAction<{
                reference: string;
                label: string;
                index: number;
            }>,
        ) => {
            if (!display) display = {};
            display.series = display.series || {};
            display.series[action.payload.reference] = {
                ...display.series[action.payload.reference],
                yAxisIndex: action.payload.index,
                label: action.payload.label,
            };
        },

        setYAxisPosition: (
            { display },
            action: PayloadAction<{
                index: number;
                position: string | undefined;
            }>,
        ) => {
            if (!display) display = {};

            display.yAxis = display.yAxis || [];
            display.yAxis = display.yAxis || [];

            const { index, position } = action.payload;
            if (display.yAxis[index] === undefined) {
                display.yAxis[index] = {
                    position,
                };
            } else {
                display.yAxis[index].position = position;
            }
        },

        addYAxisField: (state) => {
            if (!state?.fieldConfig) return;

            const allOptions = [
                ...state.options.valuesLayoutOptions.preAggregated,
                ...state.options.valuesLayoutOptions.customAggregations,
            ];

            const yAxisFields = state.fieldConfig.y;
            const yAxisFieldsAvailable = allOptions.filter(
                (option) =>
                    !yAxisFields
                        .map((y) => y.reference)
                        .includes(option.reference),
            );

            let defaultYAxisField;

            if (yAxisFieldsAvailable.length > 0) {
                defaultYAxisField = yAxisFieldsAvailable[0];
            } else {
                defaultYAxisField = state.fieldConfig.y[0];
            }

            if (yAxisFields) {
                state.fieldConfig.y.push({
                    reference: defaultYAxisField.reference,
                    aggregation: VIZ_DEFAULT_AGGREGATION,
                });
            }
        },

        removeYAxisField: (state, action: PayloadAction<number>) => {
            if (!state.fieldConfig?.y) return;

            const index = action.payload;
            state.fieldConfig.y.splice(index, 1);

            if (state.display) {
                if (state.display.yAxis) {
                    state.display.yAxis.splice(index, 1);
                }

                if (state.display.series) {
                    Object.entries(state.display.series).forEach(
                        ([key, series]) => {
                            if (series.yAxisIndex === index) {
                                // NOTE: Delete series from display object when it's removed from yAxis
                                delete state.display?.series?.[key];
                            } else if (
                                // NOTE: Decrease yAxisIndex for series that are after the removed yAxis
                                series.yAxisIndex &&
                                series.yAxisIndex > index
                            ) {
                                series.yAxisIndex--;
                            }
                        },
                    );
                }
            }
        },

        removeXAxisField: (state) => {
            if (!state.fieldConfig) return;
            delete state.fieldConfig.x;
        },

        setSortBy: (
            { fieldConfig },
            action: PayloadAction<PivotChartLayout['sortBy']>,
        ) => {
            if (!fieldConfig) return;
            fieldConfig.sortBy = action.payload;
        },

        setStacked: ({ display }, action: PayloadAction<boolean>) => {
            if (!display) return;

            display = display || {};

            display.stack = action.payload;
        },

        setYAxisFormat: (
            { fieldConfig, display },
            action: PayloadAction<{ format: string }>,
        ) => {
            if (!fieldConfig) return;
            display = display || {};

            const validFormat = isFormat(action.payload.format)
                ? action.payload.format
                : undefined;

            display.yAxis = display.yAxis || [];

            if (display.yAxis.length === 0) {
                display.yAxis.push({ format: validFormat });
            } else {
                display.yAxis[0].format = validFormat;
            }

            // Update the format for series with yAxisIndex 0
            if (display.series) {
                Object.values(display.series).forEach((series) => {
                    if (series.yAxisIndex === 0) {
                        series.format = validFormat;
                    }
                });
            } else if (fieldConfig?.y[0].reference) {
                display.series = {
                    [fieldConfig?.y[0].reference]: {
                        format: validFormat,
                        yAxisIndex: 0,
                    },
                };
            }
        },
        setSeriesFormat: (
            { display },
            action: PayloadAction<{
                index: number;
                format: string;
                reference: string;
            }>,
        ) => {
            if (!display) return;
            display = display || {};
            display.yAxis = display.yAxis || [];
            display.series = display.series || {};

            const { index, format, reference } = action.payload;
            const validFormat = isFormat(format) ? format : undefined;

            display.series = display.series || {};
            display.series[reference] = {
                ...display.series[reference],
                format: validFormat,
                yAxisIndex: index,
            };

            if (index === 0) {
                display.yAxis = display.yAxis || [];
                display.yAxis[0] = {
                    ...display.yAxis[0],
                    format: validFormat,
                };
            }
        },
        setSeriesChartType: (
            { display },
            action: PayloadAction<{
                index: number;
                type: NonNullable<
                    CartesianChartDisplay['series']
                >[number]['type'];
                reference: string;
            }>,
        ) => {
            if (!display) return;
            display = display || {};
            display.series = display.series || {};

            const { index, type, reference } = action.payload;

            display.series = display.series || {};
            display.series[reference] = {
                ...display.series[reference],
                yAxisIndex: index,
                type,
            };
        },
        setSeriesColor: (
            { fieldConfig, display },
            action: PayloadAction<{
                reference: string;
                color: string;
                index?: number;
            }>,
        ) => {
            if (!fieldConfig) return;
            display = display || {};
            display.yAxis = display.yAxis || [];
            display.series = display.series || {};

            if (fieldConfig?.y.length === 1) {
                const yReference = fieldConfig?.y[0].reference;
                if (yReference) {
                    display.series[yReference] = {
                        ...display.series[yReference],
                        yAxisIndex: 0,
                        color: action.payload.color,
                    };
                }
            }
            if (action.payload.index !== undefined) {
                display.series[action.payload.reference] = {
                    ...display.series[action.payload.reference],
                    yAxisIndex: action.payload.index,
                    color: action.payload.color,
                };
            }
        },
    },
});
