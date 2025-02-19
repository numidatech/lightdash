import {
    DimensionType,
    FilterOperator,
    FilterType,
    assertUnreachable,
    formatBoolean,
    formatDate,
    getFilterTypeFromItem,
    getItemId,
    getLocalTimeDisplay,
    isCustomSqlDimension,
    isDashboardFilterRule,
    isDimension,
    isField,
    isFilterRule,
    isFilterableItem,
    isMomentInput,
    type ConditionalRule,
    type ConditionalRuleLabels,
    type CustomSqlDimension,
    type Field,
    type FilterableDimension,
    type FilterableItem,
    type TableCalculation,
} from '@lightdash/common';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { type MomentInput } from 'moment';
import { filterOperatorLabel } from './constants';

const getFilterOptions = <T extends FilterOperator>(
    operators: Array<T>,
): Array<{ value: T; label: string }> =>
    operators.map((operator) => ({
        value: operator,
        label: filterOperatorLabel[operator],
    }));

const timeFilterOptions: Array<{
    value: FilterOperator;
    label: string;
}> = [
    ...getFilterOptions([
        FilterOperator.NULL,
        FilterOperator.NOT_NULL,
        FilterOperator.EQUALS,
        FilterOperator.NOT_EQUALS,
        FilterOperator.IN_THE_PAST,
        FilterOperator.NOT_IN_THE_PAST,
        FilterOperator.IN_THE_NEXT,
        FilterOperator.IN_THE_CURRENT,
        FilterOperator.NOT_IN_THE_CURRENT,
    ]),
    { value: FilterOperator.LESS_THAN, label: 'is before' },
    { value: FilterOperator.LESS_THAN_OR_EQUAL, label: 'is on or before' },
    { value: FilterOperator.GREATER_THAN, label: 'is after' },
    { value: FilterOperator.GREATER_THAN_OR_EQUAL, label: 'is on or after' },
    { value: FilterOperator.IN_BETWEEN, label: 'is between' },
];

export const getFilterOperatorOptions = (
    filterType: FilterType,
): Array<{ value: FilterOperator; label: string }> => {
    switch (filterType) {
        case FilterType.STRING:
            return getFilterOptions([
                FilterOperator.NULL,
                FilterOperator.NOT_NULL,
                FilterOperator.EQUALS,
                FilterOperator.NOT_EQUALS,
                FilterOperator.STARTS_WITH,
                FilterOperator.ENDS_WITH,
                FilterOperator.INCLUDE,
                FilterOperator.NOT_INCLUDE,
            ]);
        case FilterType.NUMBER:
            return getFilterOptions([
                FilterOperator.NULL,
                FilterOperator.NOT_NULL,
                FilterOperator.EQUALS,
                FilterOperator.NOT_EQUALS,
                FilterOperator.LESS_THAN,
                FilterOperator.GREATER_THAN,
            ]);
        case FilterType.DATE:
            return timeFilterOptions;
        case FilterType.BOOLEAN:
            return getFilterOptions([
                FilterOperator.NULL,
                FilterOperator.NOT_NULL,
                FilterOperator.EQUALS,
            ]);
        default:
            return assertUnreachable(
                filterType,
                `Unexpected filter type: ${filterType}`,
            );
    }
};

const getValueAsString = (
    filterType: FilterType,
    rule: ConditionalRule,
    field: Field | TableCalculation | CustomSqlDimension,
) => {
    const { operator, values } = rule;
    const firstValue = values?.[0];
    const secondValue = values?.[1];

    switch (filterType) {
        case FilterType.STRING:
        case FilterType.NUMBER:
            return values?.join(', ');
        case FilterType.BOOLEAN:
            return values?.map(formatBoolean).join(', ');
        case FilterType.DATE:
            switch (operator) {
                case FilterOperator.IN_THE_PAST:
                case FilterOperator.NOT_IN_THE_PAST:
                case FilterOperator.IN_THE_NEXT:
                    if (!isFilterRule(rule)) throw new Error('Invalid rule');

                    return `${firstValue} ${
                        rule.settings?.completed ? 'completed ' : ''
                    }${rule.settings?.unitOfTime}`;
                case FilterOperator.IN_BETWEEN:
                    if (
                        isDimension(field) &&
                        isMomentInput(firstValue) &&
                        isMomentInput(secondValue) &&
                        field.type === DimensionType.DATE
                    ) {
                        return `${formatDate(
                            firstValue as MomentInput,
                            field.timeInterval,
                        )} and ${formatDate(
                            secondValue as MomentInput,
                            field.timeInterval,
                        )}`;
                    }
                    return `${getLocalTimeDisplay(
                        firstValue as MomentInput,
                        false,
                    )} and ${getLocalTimeDisplay(secondValue as MomentInput)}`;
                case FilterOperator.IN_THE_CURRENT:
                case FilterOperator.NOT_IN_THE_CURRENT:
                    if (!isFilterRule(rule)) throw new Error('Invalid rule');

                    return rule.settings?.unitOfTime.slice(0, -1);
                case FilterOperator.NULL:
                case FilterOperator.NOT_NULL:
                case FilterOperator.EQUALS:
                case FilterOperator.NOT_EQUALS:
                case FilterOperator.STARTS_WITH:
                case FilterOperator.ENDS_WITH:
                case FilterOperator.INCLUDE:
                case FilterOperator.NOT_INCLUDE:
                case FilterOperator.LESS_THAN:
                case FilterOperator.LESS_THAN_OR_EQUAL:
                case FilterOperator.GREATER_THAN:
                case FilterOperator.GREATER_THAN_OR_EQUAL:
                    return values
                        ?.map((value) => {
                            const type = isCustomSqlDimension(field)
                                ? field.dimensionType
                                : field.type;
                            if (
                                isDimension(field) &&
                                isMomentInput(value) &&
                                type === DimensionType.TIMESTAMP
                            ) {
                                return getLocalTimeDisplay(value);
                            } else if (
                                isDimension(field) &&
                                isMomentInput(value) &&
                                type === DimensionType.DATE
                            ) {
                                return formatDate(value, field.timeInterval);
                            } else {
                                return value;
                            }
                        })
                        .join(', ');
                default:
                    return assertUnreachable(
                        operator,
                        `Unexpected operator: ${operator}`,
                    );
            }
        default:
            return assertUnreachable(
                filterType,
                `Unexpected filter type: ${filterType}`,
            );
    }
};

export const getConditionalRuleLabel = (
    rule: ConditionalRule,
    item: FilterableItem,
): ConditionalRuleLabels => {
    const filterType = isFilterableItem(item)
        ? getFilterTypeFromItem(item)
        : FilterType.STRING;
    const operatorOptions = getFilterOperatorOptions(filterType);
    const operationLabel =
        operatorOptions.find((o) => o.value === rule.operator)?.label ||
        filterOperatorLabel[rule.operator];

    return {
        field: isField(item) ? item.label : item.name,
        operator: operationLabel,
        value: getValueAsString(filterType, rule, item),
    };
};

export const getFilterRuleTables = (
    filterRule: ConditionalRule,
    field: FilterableDimension,
    filterableFields: FilterableDimension[],
): string[] => {
    if (
        isDashboardFilterRule(filterRule) &&
        filterRule.tileTargets &&
        !isEmpty(filterRule.tileTargets)
    ) {
        return Object.values(filterRule.tileTargets).reduce<string[]>(
            (tables, tileTarget) => {
                const targetField = filterableFields.find(
                    (f) =>
                        tileTarget !== false &&
                        f.table === tileTarget.tableName &&
                        getItemId(f) === tileTarget.fieldId,
                );
                return targetField
                    ? uniq([...tables, targetField.tableLabel])
                    : tables;
            },
            [],
        );
    } else {
        return [field.tableLabel];
    }
};
