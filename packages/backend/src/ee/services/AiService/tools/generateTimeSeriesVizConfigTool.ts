import { DynamicStructuredTool } from '@langchain/core/tools';
import {
    AiWebAppPrompt,
    getErrorMessage,
    isSlackPrompt,
    SlackPrompt,
    UpdateSlackResponse,
} from '@lightdash/common';
import * as Sentry from '@sentry/node';
import { z } from 'zod';
import { SlackClient } from '../../../../clients/Slack/SlackClient';
import Logger from '../../../../logging/logger';
import {
    generateTimeSeriesVizConfigToolSchema,
    renderTimeseriesChart,
} from '../charts/timeSeriesChart';
import { RunMiniMetricQuery } from '../runMiniMetricQuery/runMiniMetricQuery';

type GetGenerateTimeSeriesVizConfigToolArgs = {
    updateProgress: (progress: string) => Promise<void>;
    runMiniMetricQuery: RunMiniMetricQuery;
    getPrompt: () => Promise<SlackPrompt | AiWebAppPrompt>;
    updatePrompt: (prompt: UpdateSlackResponse) => Promise<void>;
    sendFile: InstanceType<typeof SlackClient>['postFileToThread'];
};
export const getGenerateTimeSeriesVizConfigTool = ({
    updateProgress,
    runMiniMetricQuery,
    getPrompt,
    sendFile,
    updatePrompt,
}: GetGenerateTimeSeriesVizConfigToolArgs) => {
    const schema = generateTimeSeriesVizConfigToolSchema;

    return new DynamicStructuredTool({
        name: 'generateTimeSeriesVizConfig',
        description: `Generate Time Series Chart Visualization and show it to the user.

This tool works well for questions about data over time, e.g. "per day/week/month".

Example questions:
- "Show me the revenue per day for the last 30 days."
- "Show me the number of orders per week for the last 6 months."

Rules for generating the time series chart visualization:
- The dimension and metric "fieldIds" must come from an explore. If you haven't used "findFieldsInExplore" tool, please do so before using this tool.
- If the data needs to be filtered, generate the filters using the "generateQueryFilters" tool before using this tool.`,
        schema,
        func: async ({ filters, vizConfig }: z.infer<typeof schema>) => {
            try {
                await updateProgress(
                    '🔍 Running a query for your line chart...',
                );

                const prompt = await getPrompt();

                await updateProgress('📈 Generating your line chart...');

                const { file, metricQuery } = await renderTimeseriesChart({
                    runMetricQuery: runMiniMetricQuery,
                    vizConfig,
                    filters,
                });

                await updatePrompt({
                    promptUuid: prompt.promptUuid,
                    vizConfigOutput: vizConfig,
                    metricQuery,
                });

                if (isSlackPrompt(prompt)) {
                    const sentfileArgs = {
                        channelId: prompt.slackChannelId,
                        threadTs: prompt.slackThreadTs,
                        organizationUuid: prompt.organizationUuid,
                        title: 'Generated by Lightdash',
                        comment: `Line chart generated by Lightdash`,
                        filename: 'lightdash-query-results.png',
                        file,
                    };
                    await sendFile(sentfileArgs);
                }

                return `A line chart has been successfully generated and shown to the user.`;
            } catch (e) {
                Logger.debug('Error generating line chart visualization', e);
                Sentry.captureException(e);

                return `There was an error generating the line chart.

Here's the original error message:
\`\`\`
${getErrorMessage(e)}
\`\`\`

Please try again.`;
            }
        },
    });
};
