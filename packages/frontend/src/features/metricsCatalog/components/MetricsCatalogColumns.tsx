import { type CatalogField } from '@lightdash/common';
import { Box, Group, Highlight, HoverCard, Text } from '@mantine/core';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { type MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import { useAppSelector } from '../../sqlRunner/store/hooks';
import { CatalogCategory } from './CatalogCategory';
import { MetricChartUsageButton } from './MetricChartUsageButton';
import { MetricsCatalogCategoryForm } from './MetricsCatalogCategoryForm';
import { MetricsCatalogColumnName } from './MetricsCatalogColumnName';

export const MetricsCatalogColumns: MRT_ColumnDef<CatalogField>[] = [
    {
        accessorKey: 'name',
        header: 'Metric Name',
        enableSorting: true,
        enableEditing: false,
        Cell: MetricsCatalogColumnName,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        enableSorting: false,
        enableEditing: false,
        size: 400,
        Cell: ({ table, row }) => (
            <HoverCard
                withinPortal
                shadow="lg"
                position="right"
                disabled={!row.original.description}
            >
                <HoverCard.Target>
                    <Text lineClamp={2}>
                        <Highlight
                            highlight={table.getState().globalFilter || ''}
                        >
                            {row.original.description ?? ''}
                        </Highlight>
                    </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <MarkdownPreview
                        source={row.original.description}
                        style={{
                            fontSize: '12px',
                        }}
                    />
                </HoverCard.Dropdown>
            </HoverCard>
        ),
    },
    {
        accessorKey: 'directory',
        header: 'Table',
        enableSorting: false,
        enableEditing: false,
        size: 150,
        Cell: ({ row }) => <Text fw={500}>{row.original.tableName}</Text>,
    },
    {
        accessorKey: 'categories',
        header: 'Category',
        enableSorting: false,
        enableEditing: true,
        size: 150,
        minSize: 180,
        mantineTableBodyCellProps: () => {
            return {
                pos: 'relative',
                sx: {
                    padding: 0,
                    '&:hover': {
                        outline: 'none',
                    },
                },
            };
        },
        Edit: ({ table, row, cell }) => {
            const canManageTags = useAppSelector(
                (state) => state.metricsCatalog.abilities.canManageTags,
            );

            const categories = useMemo(
                () => row.original.categories ?? [],
                [row],
            );

            return (
                <Group spacing="two" pos="relative" w="100%" h="100%">
                    {categories.map((category) => (
                        <CatalogCategory
                            key={category.tagUuid}
                            category={category}
                        />
                    ))}
                    {canManageTags && (
                        <MetricsCatalogCategoryForm
                            catalogSearchUuid={row.original.catalogSearchUuid}
                            metricCategories={categories}
                            opened={
                                table.getState().editingCell?.id === cell.id
                            }
                            onClose={() => {
                                table.setEditingCell(null);
                            }}
                        />
                    )}
                </Group>
            );
        },
        Cell: ({ row, table, cell }) => {
            const categories = useMemo(
                () => row.original.categories ?? [],
                [row],
            );

            return (
                // This is a hack to make the whole cell clickable and avoid race conditions with click outside events
                <Box
                    pos="absolute"
                    p="md"
                    left={0}
                    top={0}
                    w="100%"
                    h="100%"
                    onClick={() => {
                        table.setEditingCell(cell);
                    }}
                >
                    <Group spacing="two" pos="relative" w="100%" h="100%">
                        {categories.map((category) => (
                            <CatalogCategory
                                key={category.tagUuid}
                                category={category}
                            />
                        ))}
                    </Group>
                </Box>
            );
        },
    },
    {
        accessorKey: 'chartUsage',
        header: 'Popularity',
        enableSorting: true,
        enableEditing: false,
        size: 100,
        Cell: ({ row }) => <MetricChartUsageButton row={row} />,
    },
];