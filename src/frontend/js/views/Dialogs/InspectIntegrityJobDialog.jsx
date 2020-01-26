import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'
import Tree, { TreeNode } from 'rc-tree'
import 'rc-tree/assets/index.css';

import serializeForm from 'utils/serializeForm.jsx'

class InspectIntegrityJobDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        console.log(data)

        const treeData1 = [
          { key: '0-0', title: 'parent 1', children:
            [
              { key: '0-0-0', title: 'parent 1-1', children:
                [
                  { key: '0-0-0-0', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'delete' },
                  { key: '0-0-0-1', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'insert' },
                  { key: '0-0-0-2', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'modify' },
                  { key: '0-0-0-4', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa' },
                ],
              },
              { key: '0-0-1', title: 'parent 1-2', children:
                  [
                    { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
                    { key: '0-0-1-1', title: 'parent 1-2-1' },
                  ],
              },
            ],
          },
        ]

        const treeData2 = [
          { key: '0-0', title: 'parent 1', children:
            [
              { key: '0-0-0', title: 'parent 1-1', children:
                [
                  { key: '0-0-0-0', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'delete' },
                  { key: '0-0-0-1', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'insert' },
                  { key: '0-0-0-2', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'modify' },
                  { key: '0-0-0-3', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa', type: 'modify' },
                  { key: '0-0-0-4', title: 'parent 1-1-0', hash: 'd621730bdf867a3453fb6b51a4ba0faa' },
                ],
              },
              { key: '0-0-1', title: 'parent 1-2', children:
                  [
                    { key: '0-0-1-0', title: 'parent 1-2-0', disableCheckbox: true },
                    { key: '0-0-1-1', title: 'parent 1-2-1' },
                  ],
              },
            ],
          },
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
                                        <span className='ml-2 p-1' style={styles['delete']}>
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

    _renderNodes(treeData) {
        if (!treeData || treeData.length === 0) {
            return null;
        }

        return treeData.map((node, i) => (
            <TreeNode
                key={node.key || i}
                style={styles[node.type]}
                title={
                    <React.Fragment>
                        <span>{node.title}</span>
                        <span className="rc-tree-right">{node.hash}</span>
                    </React.Fragment>
                }
            >
                {this._renderNodes(node.children)}
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

InspectIntegrityJobDialog.defaultProps = {
    data: {},
    onClose: () => {},
}

const styles = {
    'delete': { background: 'rgba(255, 0, 0, 0.1)' },
    'insert': { background: 'rgba(0, 255, 0, 0.1)' },
    'modify': { background: 'rgba(0, 0, 255, 0.1)' },
}

import {connect} from 'react-redux';
import {hideInspectIntegrityJobDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.inspectIntegrityJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideInspectIntegrityJobDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InspectIntegrityJobDialog);
