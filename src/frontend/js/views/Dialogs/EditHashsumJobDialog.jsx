import React from 'react';
import { Modal, Button, ProgressBar } from 'react-bootstrap'
import Tree, { TreeNode } from 'rc-tree'
import 'rc-tree/assets/index.css';

import parseTime from 'utils/parseTime.jsx'
import serializeForm from 'utils/serializeForm.jsx'
import { sortComparator } from 'utils/arrayUtils.jsx'
import UriResource from 'components/UriResource.jsx'

class EditHashsumJobDialog extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = null;
        this.state = EditHashsumJobDialog.initialState;
    }

    render() {
        const { data } = this.props;

        const isInProgress = data.progress_state === 'PROGRESS'

        const cloudMapping = {
            0: {
                type: 'file',
            }
        }

        this.props.clouds.forEach(connection => {
            cloudMapping[connection.id] = connection
        })

        const src_cloud_id = data['src_cloud_id'] || 0
        const src_cloud = cloudMapping[src_cloud_id]

        if (src_cloud == undefined) {
            data.src_cloud_type = "(unknown)"
        } else {
            data.src_cloud_type = src_cloud.type;
        }

        const dst_cloud_id = data['dst_cloud_id'] || 0
        const dst_cloud = cloudMapping[dst_cloud_id]

        if (dst_cloud == undefined) {
            data.dst_cloud_type = "(unknown)"
        } else {
            data.dst_cloud_type = dst_cloud.type;
        }

        let treeLeft;
        try {
            treeLeft = JSON.parse(data.progress_src_tree || '[]')
        } catch (e) {
            console.error(e, data.progress_src_tree)
            treeLeft = []
        }

        let treeRight;
        try {
            treeRight = JSON.parse(data.progress_dst_tree || '[]')
        } catch (e) {
            console.error(e, data.progress_dst_tree)
            treeRight = []
        }

        let diff = NodeType.LOADING
        if (!isInProgress) {
            diff = this._compareTrees(treeLeft, treeRight)
        } else {
            diff = NodeType.LOADING
        }

        const description = data.description ? ` - ${data.description}` : ''
        const progress = Math.floor(data.progress_current / data.progress_total * 100);
        const executionTime = parseTime(data.progress_execution_time);

        let statusText = '';
        let statusColor = 'default';

        if (data.progress_state === 'PROGRESS') {
            statusText = data.progress_state;
            statusColor = 'primary';
        } else if (data.progress_state === 'FAILED' || data.progress_state === 'STOPPED') {
            statusText = data.progress_state;
            statusColor = 'danger';
        } else if (data.progress_state === 'SUCCESS' && diff === NodeType.MISSING) {
            statusText = 'CANNOT DETERMINE';
            statusColor = 'danger'
        } else if (data.progress_state === 'SUCCESS' && diff === NodeType.MODIFY) {
            statusText = 'DIFFERENT';
            statusColor = 'warning'
        } else if (data.progress_state === 'SUCCESS' && diff === NodeType.IDENTICAL) {
            statusText = 'IDENTICAL';
            statusColor = 'success'
        } else if (data.progress_state === 'SUCCESS' && diff === NodeType.LOADING) {
            statusText = 'LOADING';
            statusColor = 'primary'
        }

        return (
            <div>
                <Modal
                    show={true}
                    size="xl"
                    onHide={() => this.handleClose()}
                >
                    <form action="#">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <span>Integrity Check #{data.id} - </span>
                                <b className={`text-${statusColor}`}>{statusText}</b>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                <div className="form-group">
                                    <div className="text-center">
                                        <b className={`text-${statusColor}`}>{executionTime}</b>
                                    </div>
                                    <ProgressBar
                                        now={progress}
                                        label={`${progress}%`}
                                        variant={statusColor}
                                        style={{width: '100%', height: 30}}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-6 overflow-hidden text-center">
                                        <UriResource
                                            protocol={data.src_cloud_type}
                                            path={data.src_resource_path}
                                        />
                                    </div>
                                    <div className="col-6 overflow-hidden text-center">
                                        <UriResource
                                            protocol={data.dst_cloud_type}
                                            path={data.dst_resource_path}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-6 overflow-hidden">
                                        <Tree
                                            key={Math.random()}
                                            showLine
                                            selectable={false}
                                            expandedKeys={this.state.expandedKeys}
                                            onExpand={(expandedKeys) => this.setState({expandedKeys})}
                                        >
                                            {this._renderNodes(treeLeft)}
                                        </Tree>
                                    </div>
                                    <div className="col-6 overflow-hidden">
                                        <Tree
                                            key={Math.random()}
                                            showLine
                                            selectable={false}
                                            expandedKeys={this.state.expandedKeys}
                                            onExpand={(expandedKeys) => this.setState({expandedKeys})}
                                        >
                                            {this._renderNodes(treeRight)}
                                        </Tree>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-12">
                                        <b>Legend:</b>
                                        <span className="rc-node-color-insert ml-2">
                                            <span className="rc-tree-node-content-wrapper p-1">
                                                New File
                                            </span>
                                        </span>
                                        ,
                                        <span className="rc-node-color-modify ml-2">
                                            <span className="rc-tree-node-content-wrapper p-1">
                                                Different Files
                                            </span>
                                        </span>
                                        ,
                                        <span className="rc-node-color-initial ml-2">
                                            <span className="rc-tree-node-content-wrapper p-1">
                                                Identical Files
                                            </span>
                                        </span>
                                        ,
                                        <span className="rc-node-color-missing ml-2">
                                            <span className="rc-tree-node-content-wrapper p-1">
                                                Missing MD5 Hash
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <i>
                                            <b>*</b> The md5sums above might have changed since the time this check was performed
                                        </i>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <i>
                                            <b>**</b> Under particular circumstances, the md5sums above might be incorrect
                                        </i>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <i>
                                            <b>***</b> The .snapshot (sub)directory is always ignored
                                        </i>
                                    </div>
                                </div>
                                {!isInProgress && (
                                    <div className="row">
                                        <div className="col-12">
                                            <i>
                                                <b>**** Showing only the difference</b>
                                            </i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {isInProgress && (
                                <Button className='mr-auto' variant="danger" onClick={() => this.stopJob()}>
                                    Stop Job
                                </Button>
                            )}
                            <Button variant="primary" onClick={() => this.handleClose()}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }

    _renderNodes(treeData, level=0) {
        if (!treeData || treeData.length === 0) {
            return null;
        }

        return treeData.map((node, i) => (
            <TreeNode
                key={`${level}|${i}`}
                className={`rc-node-color-${node.type}`}
                title={
                    <React.Fragment>
                        <span
                            className="rc-tree-left"
                        >{node.title}</span>
                        <span
                            className="rc-tree-right text-monospace"
                        >{node.hash}</span>
                    </React.Fragment>
                }
            >
                {this._renderNodes(node.children, level + 1)}
            </TreeNode>
        ))
    }

    componentDidMount() {
        this.props.fetchData(this.props.data.id);
        this._scheduleRefresh()
    }

    componentDidUpdate() {
        this._scheduleRefresh()
    }

    componentWillUnmount() {
        this._clearTimeout()
    }

    handleClose() {
        this.props.onClose();
    }

    stopJob() {
        if (confirm(`Are you sure you want to stop job ${this.props.data.id}`)) {
            this.props.onStopJob(this.props.data.id)
        }
    }

    _compareTrees(treeLeft, treeRight) {
        treeLeft = treeLeft || []
        treeRight = treeRight || []

        let diff = NodeType.IDENTICAL;

        let i = 0
        let j = 0
        while (i < treeLeft.length && j < treeRight.length) {
            if (treeLeft[i].title === treeRight[j].title) {
                if (this._isLeaf(treeLeft[i]) && this._isLeaf(treeRight[j])) {
                    if (!treeLeft[i].hash || !treeRight[i].hash) {
                        treeLeft[i].type = treeRight[j].type = 'missing';
                        diff = Math.max(diff, NodeType.MISSING)
                    } else if (treeLeft[i].hash !== treeRight[j].hash) {
                        treeLeft[i].type = treeRight[j].type = 'modify';
                        diff = Math.max(diff, NodeType.MODIFY)
                    } else {
                        // The leafs are the same
                    }
                } else if (this._isLeaf(treeLeft[i]) || this._isLeaf(treeRight[j])) {
                    treeLeft[i].type = treeRight[j].type = 'modify';
                    diff = Math.max(diff, NodeType.MODIFY)
                } else { // Both non leafs
                    const subtreeDiff = this._compareTrees(treeLeft[i].children, treeRight[j].children)
                    if (subtreeDiff === NodeType.MODIFY) {
                        treeLeft[i].type = treeRight[j].type = 'modify';
                    } else if (subtreeDiff === NodeType.MISSING) {
                        treeLeft[i].type = treeRight[j].type = 'missing';
                    }
                    diff = Math.max(diff, subtreeDiff)
                }
            } else if (treeLeft[i].title < treeRight[j].title) {
                treeLeft[i].type = 'insert'
                treeRight.splice(i, 0, {type: 'hidden'})
                diff = Math.max(diff, NodeType.MODIFY)
            } else {
                treeRight[j].type = 'insert'
                treeLeft.splice(j, 0, {type: 'hidden'})
                diff = Math.max(diff, NodeType.MODIFY)
            }
            i++; j++;
        }

        while (i < treeLeft.length) {
            treeLeft[i].type = 'insert'
            treeRight.splice(i, 0, {type: 'hidden'})
            diff = Math.max(diff, NodeType.MODIFY)
            i++; j++;
        }

        while (j < treeRight.length) {
            treeRight[j].type = 'insert'
            treeLeft.splice(j, 0, {type: 'hidden'})
            diff = Math.max(diff, NodeType.MODIFY)
            i++; j++;
        }
        return diff;
    }

    _isLeaf(treeNode) {
        return treeNode.isLeaf
    }

    _scheduleRefresh() {
        const refreshDelay = 1000; // 1s
        this._clearTimeout();
        this.timeout = setTimeout(() => {
            if (this.props.data.progress_state === 'PROGRESS') {
                this.props.fetchData(this.props.data.id);
            }
        }, refreshDelay)
    }

    _clearTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

}

EditHashsumJobDialog.defaultProps = {
    data: {},
    clouds: [],
    onClose: () => {},
    fetchData: (id) => {},
    onStopJob: (id) => {},
}

EditHashsumJobDialog.initialState = {
    expandedKeys: [],
}

const NodeType = {
    LOADING: -1,
    IDENTICAL: 0,
    MODIFY: 1,
    MISSING: 2,
}

import {connect} from 'react-redux';
import {hideEditHashsumJobDialog} from 'actions/dialogActions.jsx'
import {retrieveHashsumJob, stopHashsumJob} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.editHashsumJobDialogData,
    clouds: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideEditHashsumJobDialog()),
    fetchData: (id) => dispatch(retrieveHashsumJob(id)),
    onStopJob: (id) => dispatch(stopHashsumJob(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditHashsumJobDialog);
