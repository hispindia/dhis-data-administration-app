import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'material-ui';

import styles from './FeedbackSnackbar.css';

import { LOADING, SUCCESS, ERROR, WARNING, ACTION_MESSAGE } from './FeedbackSnackbarTypes';
import FeedbackSnackbarBody from './feedback-snackbar-body/FeedbackSnackbarBody';

class FeedbackSnackbar extends PureComponent {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        conf: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
            action: PropTypes.string,
            onActionClick: PropTypes.func,
        }),
    };

    static defaultProps = {
        conf: {
            type: '',
            message: '',
            action: '',
            onActionClick: null,
        },
    }

    static contextTypes = {
        translator: PropTypes.func,
        updateAppState: PropTypes.func,
    };

    static getStyle(type) {
        switch (type) {
        case SUCCESS:
            return styles.success;
        case LOADING:
            return styles.loading;
        case ERROR:
            return styles.error;
        case WARNING:
            return styles.warning;
        default:
            return null;
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            style: styles.warning,
            snackBarContent: '',
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            style: FeedbackSnackbar.getStyle(props.conf.type),
            show: props.show,
        });
    }

    handleRequestClose = () => {
        if (this.props.conf.type !== LOADING) {
            this.context.updateAppState({
                showSnackbar: false,
            });
        }
    };

    render() {
        const snackBarContent = this.props.conf.type === ACTION_MESSAGE
            ? this.props.conf.message
            : (<FeedbackSnackbarBody type={this.props.conf.type} message={this.props.conf.message} />);

        return (
            <Snackbar
                action={this.props.conf.action}
                onActionClick={this.props.conf.onActionClick}
                open={this.state.show}
                message={snackBarContent}
                onRequestClose={this.handleRequestClose}
                className={this.state.style}
            />
        );
    }
}

export default FeedbackSnackbar;
