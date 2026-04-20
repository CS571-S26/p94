import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function SaveFlowModal({ show, onClose, onSave, isSaving }) {
    const [flowName, setFlowName] = useState('');

    const handleSave = () => {
        if (flowName.trim()) {
            onSave(flowName.trim());
            setFlowName('');
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    Name your flow
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="text"
                    placeholder="e.g. Morning energiser"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose} disabled={isSaving}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!flowName.trim() || isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save flow'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}