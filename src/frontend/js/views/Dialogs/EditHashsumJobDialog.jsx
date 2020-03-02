import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'
import Tree, { TreeNode } from 'rc-tree'
import 'rc-tree/assets/index.css';

import serializeForm from 'utils/serializeForm.jsx'

class EditHashsumJobDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        const treeData1 = [
            { title: 'home', children: [
                { title: 'user1', children: [
                    { title: 'file1.txt', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'modify' },
                    { title: 'file2.txt', hash: 'cff7e86786af3a8b935fe400df121633', },
                    { title: 'file3.txt', hash: '2c71089ec817281108e0e755602e53d1', type: 'insert' },
                    { title: 'file4.txt', hash: '006d6d7b018ab527438aedc9bcbe0e3f', type: 'hidden' },
                    { title: 'README.md', hash: '9657f83b32d8a23c740c2852b26b8e7d' },
                ]},
                { title: 'user2', children: [
                    { title: 'sketches.jpg', hash: 'f44988f6977e2566a795f1b3c5c58523' },
                    { title: 'sketches.png', hash: 'd482f76f6530eb93a9a368664a150439' },
                ]},
                { title: 'user3', children: [
                    { title: 'file1.txt', hash: 'f44988f6977e2566a795f1b3c5c58523' },
                    { title: 'file2.txt', hash: 'd482f76f6530eb93a9a368664a150439', type: 'missing' },
                ]},
            ]},
        ]

        const treeData2 = [
            { title: 'home', children: [
                { title: 'user1', children: [
                    { title: 'file1.txt', hash: 'a63702c86927fd67fc2d59c5a0a8e830', type: 'modify' },
                    { title: 'file2.txt', hash: 'cff7e86786af3a8b935fe400df121633', },
                    { title: 'file3.txt', hash: '2c71089ec817281108e0e755602e53d1', type: 'hidden' },
                    { title: 'file4.txt', hash: '006d6d7b018ab527438aedc9bcbe0e3f', type: 'insert' },
                    { title: 'README.md', hash: '9657f83b32d8a23c740c2852b26b8e7d' },
                ]},
                { title: 'user2', children: [
                    { title: 'sketches.jpg', hash: 'f44988f6977e2566a795f1b3c5c58523' },
                    { title: 'sketches.png', hash: 'd482f76f6530eb93a9a368664a150439' },
                ]},
                { title: 'user3', children: [
                    { title: 'file1.txt', hash: 'f44988f6977e2566a795f1b3c5c58523' },
                    { title: 'file2.txt', hash: '', type: 'missing' },
                ]},
            ]},
        ]

        return (
            <div className='dialog-inspect-integrity'>
                <Modal
                    show={true}
                    size="xl"
                    onHide={() => this.handleClose()}
                >
                    <form action="#">
                        <Modal.Header closeButton>
                            <Modal.Title>Integrity Check Result</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                <div className="row">
                                    <div className="col-6">
                                        <Tree
                                            showLine
                                            defaultExpandAll
                                            selectable={false}
                                        >
                                            {this._renderNodes(treeData1)}
                                        </Tree>
                                    </div>
                                    <div className="col-6">
                                        <Tree
                                            showLine
                                            defaultExpandAll
                                            selectable={false}
                                        >
                                            {this._renderNodes(treeData2)}
                                        </Tree>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-12">
                                        <b>Legend:</b>
                                        <span className='ml-2 p-1' style={styles['insert']}>
                                            New File
                                        </span>
                                        ,
                                        <span className='ml-2 p-1' style={styles['modify']}>
                                            Different files
                                        </span>
                                        ,
                                        <span className='ml-2'>
                                            Identical Files
                                        </span>
                                        ,
                                        <span className='ml-2 p-1' style={styles['missing']}>
                                            Missing MD5 hash
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
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
                style={styles[node.type]}
                title={
                    <React.Fragment>
                        <span
                            style={{fontSize: '14px'}}
                        >{node.title}</span>
                        <span
                            className="rc-tree-right text-monospace"
                            style={{fontSize: '12px'}}
                        >{node.hash}</span>
                    </React.Fragment>
                }
            >
                {this._renderNodes(node.children, level + 1)}
            </TreeNode>
        ))
    }

    handleClose() {
        this.props.onClose();
    }

    // This will be moved to happen on data fetch for performance reasons
    _preprocessData(data) {
        const {left, right} = data;
    }
}

EditHashsumJobDialog.defaultProps = {
    data: {},
    onClose: () => {},
}

const styles = {
    'missing': { background: 'rgba(255, 0, 0, 0.1)' },
    'insert': { background: 'rgba(0, 255, 0, 0.1)' },
    'modify': { background: 'rgba(0, 0, 255, 0.1)' },
    'hidden': { color: 'white' },
}

import {connect} from 'react-redux';
import {hideEditHashsumJobDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.editHashsumJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideEditHashsumJobDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditHashsumJobDialog);
