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

        const treeData = [
          { key: '0-0', title: 'parent 1', children:
            [
              { key: '0-0-0', title: 'parent 1-1', children:
                [
                  { key: '0-0-0-0', title: 'parent 1-1-0', hash: 'asdsad' },
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
        ];


        return (
            <div className='dialog-inspect-integrity'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#">
                        <Modal.Header closeButton>
                            <Modal.Title>Integrity Check Result</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                <Tree
                                    showLine
                                    defaultExpandAll
                                    selectable={false}
                                >
                                    {this._renderNodes(treeData)}
                                </Tree>
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

    _renderTreeRow(title, hash) {
        return (
            <TreeNode title={
                <React.Fragment>
                    <span>{title}</span>
                    <span className="rc-tree-right">{hash}</span>
                </React.Fragment>
            } />
        )
    }

    _renderNodes(treeData) {
        if (!treeData || treeData.length === 0) {
            return null;
        }

        return treeData.map((node, i) => {
            return (
                <TreeNode key={node.key || i} title={
                    <React.Fragment>
                        <span>{node.title}</span>
                        <span className="rc-tree-right">{node.hash}</span>
                    </React.Fragment>
                }>
                    {this._renderNodes(node.children)}
                </TreeNode>
            )
        })
    }


    // <TreeNode title="parent 1" key="0-0">
    //     <TreeNode title='asd' key="0-0-0">
    //         <TreeNode title="leaf" key="0-0-0-0" style={{ background: 'rgba(255, 0, 0, 0.1)' }} />
    //         {this._renderTreeRow('Hello World', 'foo')}
    //     </TreeNode>
    //     <TreeNode title="parent 1-1" key="0-0-1">
    //         <TreeNode title="parent 1-1-0" key="0-0-1-0" />
    //         <TreeNode title="parent 1-1-1" key="0-0-1-1" />
    //     </TreeNode>
    //     <TreeNode title="parent 1-2" key="0-0-2" disabled>
    //         <TreeNode title="parent 1-2-0" key="0-0-2-0" />
    //         <TreeNode title="parent 1-2-1" key="0-0-2-1" />
    //     </TreeNode>
    // </TreeNode>


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

import {connect} from 'react-redux';
import {hideInspectIntegrityJobDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.inspectIntegrityJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideInspectIntegrityJobDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InspectIntegrityJobDialog);
