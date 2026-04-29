import { Modal, Button } from 'react-bootstrap';

export default function CreateFlowHelp({ show, onClose }) {
    return (
        <Modal show={show} onHide={onClose} centered size="md">
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    How to create flows using FlowState
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-4">

                    <div className="d-flex gap-3">
                        <div style={{
                            minWidth: 36, height: 36, borderRadius: 8,
                            background: '#EEEDFE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 18
                        }}>🔍</div>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: 3 }}>Search & filter poses</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                Use the search bar to find poses by English or Sanskrit name. 
                                Use the dropdowns to filter by category or difficulty level. 
                                Filters apply instantly. Search takes effect when you press <strong>Search</strong> or Enter.
                                Click <strong>Reset</strong> to remove search criteria.
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        <div style={{
                            minWidth: 36, height: 36, borderRadius: 8,
                            background: '#EEEDFE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 18
                        }}>➕</div>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: 3 }}>Add poses to your flow</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                Click <strong>+ Add to flow</strong> on any pose card to add it to your 
                                sequence. The same pose can be added more than once. Added poses appear 
                                in the flow strip at the top of the page.
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        <div style={{
                            minWidth: 36, height: 36, borderRadius: 8,
                            background: '#EEEDFE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 18
                        }}>↔️</div>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: 3 }}>Reorder poses</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                Drag and drop poses in the flow strip, or click the left/right arrows to reorder them. 
                                Each pose shows its position number so you can keep track of your sequence.
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        <div style={{
                            minWidth: 36, height: 36, borderRadius: 8,
                            background: '#EEEDFE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 18
                        }}>✕</div>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: 3 }}>Remove a pose</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                Click the <strong>×</strong> badge on any pose in the flow strip to remove 
                                it from your sequence. To start over, click <strong>Clear</strong>.
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        <div style={{
                            minWidth: 36, height: 36, borderRadius: 8,
                            background: '#E1F5EE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 18
                        }}>💾</div>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: 3 }}>Save your flow</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                When you're happy with your sequence, click <strong>Save flow</strong>. 
                                You'll be prompted to give your flow a name. Saved flows can be found 
                                on your <strong>My Flows</strong> page.
                            </div>
                        </div>
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>Got it</Button>
            </Modal.Footer>
        </Modal>
    );
}