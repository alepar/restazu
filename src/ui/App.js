import PropTypes from 'prop-types';
import React from 'react';
import { connect } from "react-redux";

import ReactDataGrid from "react-data-grid";
import { ProgressBar } from "react-bootstrap";

class App extends React.Component {

    constructor(props) {
        super(props);

        this._columns = [
            {
                key: 'torrentName',
                name: 'Name',
            },
            {
                key: 'status',
                name: 'Status',
                width: 100,
                cellClass: "aligncenter",
            },
            {
                key: 'done',
                name: 'Done',
                width: 60,
                formatter: DoneFormatter,
                cellClass: "aligncenter",
                getRowMetaData: (row) => row
            },
            {
                key: 'sizeBytes',
                name: 'Size',
                width: 80,
                formatter: SizeFormatter,
                cellClass: "alignright",
            },
            {
                key: 'uploadBps',
                name: 'UL speed',
                width: 80,
                formatter: SpeedFormatter,
                cellClass: "alignright",
            },
            {
                key: 'uploadedBytes',
                name: 'ULed',
                width: 80,
                formatter: SizeFormatter,
                cellClass: "alignright",
            },
        ];

        if (0 === this.props.list.length) {
            this.props.dispatch({
                type: "sagas.torrents.list.fetch",
            });
        }
    }

    rowGetter(i) {
        return this.props.list[i];
    }

    render() {
        if (this.props.list.length) {
            return (
                <ReactDataGrid
                    rowKey={"hash"}
                    columns={this._columns}
                    rowGetter={i => this.rowGetter(i)}
                    rowsCount={this.props.list.length}
                    minHeight={750}
                    rowHeight={26}
                />
            );
        } else {
            return (
                <div style={{
                        display: "inline-block",
                        position: "fixed",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: "150px",
                        height: "40px",
                        margin: "auto",
                }}>
                    <ProgressBar active now={100}/>
                </div>
            );
        }
    }
}

class SizeFormatter extends React.Component {
    render() {
        if (0 === this.props.value) {
            return (
                <div>-</div>
            );
        } else {
            return (
                <div>{sizeFormatter(this.props.value)}</div>
            );
        }
    }
}

SizeFormatter.propTypes = {
    value: PropTypes.number.isRequired
};

class SpeedFormatter extends React.Component {
    render() {
        if (0 === this.props.value) {
            return (
                <div>-</div>
            );
        } else {
            return (
                <div>{sizeFormatter(this.props.value)}/s</div>
            );
        }
    }
}

SpeedFormatter.propTypes = {
    value: PropTypes.number.isRequired
};

class DoneFormatter extends React.Component {
    render() {
        const row = this.props.dependentValues;
        let pct = row.downloadedBytes / row.sizeBytes * 100
        if (pct > 100) pct = 100;
        pct = pct.toFixed(0);
        return (
            <div>{pct}%</div>
        );
    }
}

DoneFormatter.propTypes = {
    value: PropTypes.number.isRequired
};

function sizeFormatter(value) {
    let factor = 1;
    value = Number(value);
    while (value > 1024) {
        factor *= 1024;
        value /= 1024;
    }
    value = value.toFixed(2);
    let suffix;
    switch (factor) {
        case 1: suffix = "B"; break;
        case 1024: suffix = "kB"; break;
        case 1024*1024: suffix = "MB"; break;
        case 1024*1024*1024: suffix = "GB"; break;
        case 1024*1024*1024*1024: suffix = "TB"; break;
        case 1024*1024*1024*1024*1024: suffix = "PB"; break;
        default: suffix = "0.oB"; break;
    }
    return `${value} ${suffix}`;
}

function mapStateToProps(state) {
    return ({
        list: state.torrents.list || [],
    });
}
export default connect(mapStateToProps)(App);
