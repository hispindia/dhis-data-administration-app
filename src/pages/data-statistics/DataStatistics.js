import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { Card, CardText } from 'material-ui/Card';

import Page from '../Page';
import DataStatisticsTable from './DataStatisticsTable';

/* constants */
import { LOADING, SUCCESS, ERROR } from '../../components/feedback-snackbar/SnackbarTypes';

const OBJECT_COUNTS_KEY = 'objectCounts';
const ACTIVE_USERS_KEY = 'activeUsers';
const USER_INVITATIONS_KEY = 'userInvitations';
const DATA_VALUE_COUNT_KEY = 'dataValueCount';
const EVENT_COUNT_KEY = 'eventCount';

const PENDING_INVITATION_ALL_KEY = 'all';
const EXPIRED_INVITATION_KEY = 'expired';

class DataStatistics extends Page {
    static propTypes = {
        pageInfo: PropTypes.object.isRequired,
    }

    constructor() {
        super();

        // state defaults
        this.state = {
            tables: [],
            loaded: false,
        };
    }

    // auxiliar functions
    static objectCountsTableObjectToShowFromServerResponse = (objectCountsResponse) => {
        if (objectCountsResponse) {
            const objectCountsKeys = Object.keys(objectCountsResponse);
            const objectCountsTable = {
                label: 'Object type',
                elements: [],
            };

            for (let i = 0; i < objectCountsKeys.length; i++) {
                const key = objectCountsKeys[i];
                objectCountsTable.elements.push({
                    label: key,
                    count: objectCountsResponse[key],
                });
            }

            return objectCountsTable;
        }

        return {};
    }

    static timeLabelFromIntProperty = (intProperty) => {
        let label = 'Last hour';
        if (intProperty === 1) {
            label = 'Today';
        } else if (intProperty > 0) {
            label = `Last ${intProperty} days`;
        }

        return label;
    }

    static activeUsersTableObjectToShowFromServerResponse = (activeUsersResponse) => {
        if (activeUsersResponse) {
            const activeUsersKeys = Object.keys(activeUsersResponse);
            const activeUsersTable = {
                label: 'Users logged in',
                elements: [],
            };

            for (let i = 0; i < activeUsersKeys.length; i++) {
                const key = activeUsersKeys[i];
                activeUsersTable.elements.push({
                    label: DataStatistics.timeLabelFromIntProperty(parseInt(key, 10)),
                    count: activeUsersResponse[key],
                });
            }

            return activeUsersTable;
        }

        return {};
    }

    static userInvitationsTableObjectToShowFromServerResponse = (userInvitationsResponse) => {
        if (userInvitationsResponse) {
            const userInvitationsTable = {
                label: 'User account invitations',
                elements: [],
            };

            if (userInvitationsResponse.hasOwnProperty(PENDING_INVITATION_ALL_KEY)) {
                userInvitationsTable.elements.push({
                    label: 'Pending invitations',
                    count: userInvitationsResponse[PENDING_INVITATION_ALL_KEY],
                });
            }

            if (userInvitationsResponse.hasOwnProperty(EXPIRED_INVITATION_KEY)) {
                userInvitationsTable.elements.push({
                    label: 'Expired invitations',
                    count: userInvitationsResponse[EXPIRED_INVITATION_KEY],
                });
            }

            return userInvitationsTable;
        }

        return {};
    }

    static dataValueCountsTableObjectToShowFromServerResponse = (dataValueCountsResponse) => {
        if (dataValueCountsResponse) {
            const dataValueCountsKeys = Object.keys(dataValueCountsResponse);
            const dataValueCountsTable = {
                label: 'Data values',
                elements: [],
            };

            for (let i = 0; i < dataValueCountsKeys.length; i++) {
                const key = dataValueCountsKeys[i];
                dataValueCountsTable.elements.push({
                    label: DataStatistics.timeLabelFromIntProperty(parseInt(key, 10)),
                    count: dataValueCountsResponse[key],
                });
            }

            return dataValueCountsTable;
        }

        return {};
    }

    static eventCountsTableObjectToShowFromServerResponse = (eventCountsResponse) => {
        if (eventCountsResponse) {
            const eventCountsKeys = Object.keys(eventCountsResponse);
            const eventCountsTable = {
                label: 'Events',
                elements: [],
            };

            for (let i = 0; i < eventCountsKeys.length; i++) {
                const key = eventCountsKeys[i];
                eventCountsTable.elements.push({
                    label: DataStatistics.timeLabelFromIntProperty(parseInt(key, 10)),
                    count: eventCountsResponse[key],
                });
            }

            return eventCountsTable;
        }

        return {};
    }

    componentDidMount() {
        const t = this.context.t;
        const api = this.context.d2.Api.getApi();

        // request to GET statistics
        if (!this.context.loading && !this.state.loaded) {
            this.context.updateAppState({
                showSnackbar: true,
                loading: true,
                snackbarConf: {
                    type: LOADING,
                    message: t('Loading...'),
                },
                pageState: {
                    loaded: false,
                    tables: [],
                },
            });

            api.get('dataSummary').then((response) => {
                if (this.isPageMounted()) {
                    const tables = [
                        DataStatistics.objectCountsTableObjectToShowFromServerResponse(response[OBJECT_COUNTS_KEY]),
                        DataStatistics.activeUsersTableObjectToShowFromServerResponse(response[ACTIVE_USERS_KEY]),
                        DataStatistics
                            .userInvitationsTableObjectToShowFromServerResponse(response[USER_INVITATIONS_KEY]),
                        DataStatistics
                            .dataValueCountsTableObjectToShowFromServerResponse(response[DATA_VALUE_COUNT_KEY]),
                        DataStatistics.eventCountsTableObjectToShowFromServerResponse(response[EVENT_COUNT_KEY]),
                    ];
                    this.context.updateAppState({
                        showSnackbar: true,
                        loading: false,
                        snackbarConf: {
                            type: SUCCESS,
                            message: t('Data Statistics were loaded.'),
                        },
                        pageState: {
                            loaded: true,
                            tables,
                        },
                    });
                }
            }).catch(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        loading: false,
                        snackbarConf: {
                            type: ERROR,
                            message: t('It was not possible to load Data Statistics'),
                        },
                        pageState: {
                            loaded: true,
                            tables: [],
                        },
                    });
                }
            });
        }
    }

    render() {
        const noContent = (
            <Card>
                <CardText>{ this.context.t(this.context.loading ? 'Loading...' : 'No data to show.') }</CardText>
            </Card>
        );

        const tables = this.state.tables.map((table) => {
            if (table && table.label && table.elements.length > 0) {
                return (
                    <DataStatisticsTable
                        key={table.label}
                        label={table.label}
                        elements={table.elements}
                    />
                );
            }
            return null;
        }).filter(table => table && !table.empty);

        const content = tables && tables.length > 0 ? tables : noContent;
        return (
            <div>
                <h1>{this.context.t(this.props.pageInfo.label)}</h1>
                {content}
            </div>
        );
    }
}

export default DataStatistics;
