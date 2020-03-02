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
        const left = this.props.data.progress_src_text || [];
        const right = this.props.data.progress_dst_text || [];

        let {treeLeft, treeRight} = this._processData(left, right)

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
                                    <div className="col-6 overflow-hidden">
                                        <Tree
                                            key={Math.random()}
                                            showLine
                                            defaultExpandAll
                                            selectable={false}
                                        >
                                            {this._renderNodes(treeLeft)}
                                        </Tree>
                                    </div>
                                    <div className="col-6 overflow-hidden">
                                        <Tree
                                            key={Math.random()}
                                            showLine
                                            defaultExpandAll
                                            selectable={false}
                                        >
                                            {this._renderNodes(treeRight)}
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
    }

    handleClose() {
        this.props.onClose();
    }

    _processData(left, right) {
        const treeLeft = this._generateTree(left)
        const treeRight = this._generateTree(right)

        return {
            treeLeft,
            treeRight,
        }
    }

    /**
     * Trees are of the form
     * [
     *     { title: 'user1', children: [
     *         { title: 'file1.txt', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'modify' },
     *     },
     * ]
     */
    _generateTree(data) {
        const tree = []
        for (let entry of data) {
            const parts = entry.Name.split('/')
            this._generateTreeLeaf(tree, parts, entry.md5chksum)
        }
        console.log(tree)
        return tree;
    }

    _generateTreeLeaf(branches, parts, md5chksum) {
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let branch = branches.find(d => d.title === part)
            if (!branch) {
                branch = {title: part, children: []}
                branches.push(branch)
            }
            if (i === parts.length - 1) {
                branch.hash = md5chksum
                delete branch.children
            } else {
                branches = branch.children
            }
        }
    }

}

EditHashsumJobDialog.defaultProps = {
    data: {},
    onClose: () => {},
    fetchData: (id) => {},
}

const styles = {
    'missing': { background: 'rgba(255, 0, 0, 0.1)' },
    'insert': { background: 'rgba(0, 255, 0, 0.1)' },
    'modify': { background: 'rgba(0, 0, 255, 0.1)' },
    'hidden': { color: 'white' },
}

import {connect} from 'react-redux';
import {hideEditHashsumJobDialog} from 'actions/dialogActions.jsx'
import {retrieveHashsumJob} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.editHashsumJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideEditHashsumJobDialog()),
    fetchData: (id) => {dispatch(retrieveHashsumJob(id))},
});

export default connect(mapStateToProps, mapDispatchToProps)(EditHashsumJobDialog);
