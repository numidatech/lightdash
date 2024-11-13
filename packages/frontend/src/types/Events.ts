export enum PageType {
    PAGE = 'page',
    MODAL = 'modal',
}

export enum PageName {
    WELCOME = 'welcome',
    REGISTER = 'register',
    LOGIN = 'login',
    PASSWORD_RECOVERY = 'password_recovery',
    PASSWORD_RESET = 'password_reset',
    SIGNUP = 'signup',
    EXPLORER = 'explorer',
    HOME = 'home',
    EXPLORE_TABLES = 'explore_tables',
    SAVED_QUERIES = 'saved_charts',
    SAVED_QUERY_EXPLORER = 'saved_chart_explorer',
    CHART_HISTORY = 'chart_history',
    PROJECT_SETTINGS = 'project_settings',
    PROFILE_SETTINGS = 'profile_settings',
    GENERAL_SETTINGS = 'general_settings',
    PASSWORD_SETTINGS = 'password_settings',
    ORGANIZATION_SETTINGS = 'organization_settings',
    USER_MANAGEMENT_SETTINGS = 'user_management_settings',
    PROJECT_MANAGEMENT_SETTINGS = 'project_management_settings',
    INVITE_MANAGEMENT_SETTINGS = 'invite_management_settings',
    PROJECT_ADD_USER = 'project_add_user',
    PROJECT_ADD_GROUP_ACCESS = 'project_add_group_access',
    PROJECT_MANAGE_GROUP_ACCESS = 'project_manage_group_access',
    PROJECT_UPDATE_GROUP_ACCESS = 'project_update_group_access',
    ABOUT_LIGHTDASH = 'about_lightdash',
    CREATE_PROJECT = 'create_project',
    CREATE_PROJECT_SETTINGS = 'create_project_settings',
    SAVED_DASHBOARDS = 'saved_dashboards',
    DASHBOARD = 'DASHBOARD',
    SQL_RUNNER = 'SQL_RUNNER',
    SEMANTIC_VIEWER_VIEW = 'SEMANTIC_VIEWER_VIEW',
    SEMANTIC_VIEWER_EDIT = 'SEMANTIC_VIEWER_EDIT',
    SOCIAL_LOGIN_SETTINGS = 'social_login_settings',
    APPEARANCE = 'appearance_settings',
    ACCESS_TOKENS = 'access_tokens',
    NO_ACCESS = 'no_access',
    NO_PROJECT_ACCESS = 'no_project_access',
    SPACE = 'space',
    SPACES = 'spaces',
    SHARE = 'share',
    USER_ACTIVITY = 'user_activity',
    VERIFY_EMAIL = 'verify_email',
    JOIN_ORGANIZATION = 'join_organization',
    CATALOG = 'catalog',
    METRICS_CATALOG = 'metrics_catalog',
}

export enum CategoryName {
    SETTINGS = 'settings',
}

export enum SectionName {
    EMPTY_RESULTS_TABLE = 'empty_results_table',
    EXPLORER_TOP_BUTTONS = 'explorer_top_buttons',
    SIDEBAR = 'sidebar',
    PAGE_CONTENT = 'page_content',
    PAGE_FOOTER = 'page_footer',
    RESULTS_TABLE = 'results_table',
    DASHBOARD_TILE = 'dashboard_tile',
}

export enum EventName {
    REVOKE_INVITES_BUTTON_CLICKED = 'revoke_invites_button.clicked',
    INVITE_BUTTON_CLICKED = 'invite_users_to_organisation_button.clicked',
    RUN_QUERY_BUTTON_CLICKED = 'run_query_button.clicked',
    ADD_COLUMN_BUTTON_CLICKED = 'add_column_button.click',
    CREATE_TABLE_CALCULATION_BUTTON_CLICKED = 'create_table_calculation_button.click',
    CREATE_QUICK_TABLE_CALCULATION_BUTTON_CLICKED = 'create_quick_table_calculation_button.click',
    EDIT_TABLE_CALCULATION_BUTTON_CLICKED = 'edit_table_calculation_button.click',
    UPDATE_TABLE_CALCULATION_BUTTON_CLICKED = 'update_table_calculation_button.click',
    DELETE_TABLE_CALCULATION_BUTTON_CLICKED = 'delete_table_calculation_button.click',
    CONFIRM_DELETE_TABLE_CALCULATION_BUTTON_CLICKED = 'confirm_delete_table_calculation_button.click',
    UPDATE_PROJECT_BUTTON_CLICKED = 'update_project_button.click',
    CREATE_PROJECT_BUTTON_CLICKED = 'create_project_button.click',
    REFRESH_DBT_CONNECTION_BUTTON_CLICKED = 'refresh_dbt_connection_button.click',
    UPDATE_PROJECT_TABLES_CONFIGURATION_BUTTON_CLICKED = 'update_project_tables_configuration.click',
    UPDATE_DASHBOARD_NAME_CLICKED = 'update_dashboard_name.click',
    DOCUMENTATION_BUTTON_CLICKED = 'documentation_button.click',
    TRY_DEMO_CLICKED = 'try_demo.clicked',
    CREATE_PROJECT_CLI_BUTTON_CLICKED = 'create_project_cli_button.click',
    CREATE_PROJECT_MANUALLY_BUTTON_CLICKED = 'create_project_manually_click.click',
    COPY_CREATE_PROJECT_CODE_BUTTON_CLICKED = 'copy_create_project_code_click.click',
    ONBOARDING_STEP_CLICKED = 'onboarding_step.click',
    SETUP_STEP_CLICKED = 'setup_step.click',
    FORM_STATE_CHANGED = 'form-state.changed',
    ADD_FILTER_CLICKED = 'add_filter.click',
    GO_TO_LINK_CLICKED = 'go_to_link.click',
    ADD_CUSTOM_METRIC_CLICKED = 'add_custom_metric.click',
    REMOVE_CUSTOM_METRIC_CLICKED = 'remove_custom_metric.click',
    // Headway-related notifications
    NOTIFICATIONS_CLICKED = 'notifications.clicked',
    NOTIFICATIONS_ITEM_CLICKED = 'notifications_item.clicked',
    NOTIFICATIONS_READ_MORE_CLICKED = 'notifications_read_more.clicked',

    CUSTOM_AXIS_RANGE_TOGGLE_CLICKED = 'custom_axis_range_toggle_clicked',
    CREATE_PROJECT_ACCESS_BUTTON_CLICKED = 'create_project_access.clicked',
    SEARCH_RESULT_CLICKED = 'search_result.clicked',
    GLOBAL_SEARCH_OPEN = 'global_search.open',
    GLOBAL_SEARCH_CLOSED = 'global_search.closed',
    CROSS_FILTER_DASHBOARD_APPLIED = 'cross_filtering_apply.click',
    USAGE_ANALYTICS_CLICKED = 'usage_analytics_clicked',
    VIEW_UNDERLYING_DATA_CLICKED = 'view_underlying_data.clicked',
    DRILL_BY_CLICKED = 'drill_by.clicked',
    SCHEDULER_SEND_NOW_BUTTON = 'send_now_button.clicked',
    ADD_CUSTOM_DIMENSION_CLICKED = 'add_custom_dimension.clicked',
    DATE_ZOOM_CLICKED = 'date_zoom.clicked',
    COMMENTS_CLICKED = 'comments.clicked',
    NOTIFICATIONS_COMMENTS_ITEM_CLICKED = 'notifications_comments_item.clicked',
    DASHBOARD_AUTO_REFRESH_UPDATED = 'dashboard_auto_refresh.updated',

    // Metrics Catalog
    METRICS_CATALOG_CHART_USAGE_CLICKED = 'metrics_catalog_chart_usage.clicked',
    METRICS_CATALOG_CHART_USAGE_CHART_CLICKED = 'metrics_catalog_chart_usage_chart.clicked',
    METRICS_CATALOG_EXPLORE_CLICKED = 'metrics_catalog_explore.clicked',
    METRICS_CATALOG_CATEGORY_CLICKED = 'metrics_catalog_category.clicked',
    METRICS_CATALOG_CATEGORY_FILTER_APPLIED = 'metrics_catalog_category_filter.applied',
    METRICS_CATALOG_ICON_APPLIED = 'metrics_catalog_icon.applied',
}
