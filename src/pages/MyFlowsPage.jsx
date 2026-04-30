import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { Row, Col, Card, Button, Modal, Form, Spinner } from 'react-bootstrap';
import SuccessToast from '../components/SuccessToast';

export default function MyFlowsPage() {
    const [user] = useAuthState(auth);
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [viewFlow, setViewFlow] = useState(null); // holds the flow being viewed
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
 

    const showSuccess = (message) => {
    setToastMessage(message);
    setShowToast(true);
    };

    // rename modal state
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameTarget, setRenameTarget] = useState(null); // { id, name }
    const [newName, setNewName] = useState('');
    const [renaming, setRenaming] = useState(false);

    // delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (location.state?.openFlow) {
            setViewFlow(location.state.openFlow);
        }
    }, [location.state]);

    useEffect(() => {
        if (!user) return;
        const fetchFlows = async () => {
            const q = query(
                collection(db, 'users', user.uid, 'flows'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            setFlows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchFlows();
    }, [user]);

    const openRename = (flow) => {
        setRenameTarget(flow);
        setNewName(flow.name);
        setShowRenameModal(true);
    };

    const handleRename = async () => {
        if (!newName.trim() || newName.trim() === renameTarget.name) {
            setShowRenameModal(false);
            return;
        }
        setRenaming(true);
        try {
            await updateDoc(doc(db, 'users', user.uid, 'flows', renameTarget.id), {
                name: newName.trim()
            });
            setFlows(prev => prev.map(f =>
                f.id === renameTarget.id ? { ...f, name: newName.trim() } : f
            ));
            setShowRenameModal(false);
            showSuccess('Flow renamed successfully!');
        } catch (err) {
            console.error('Failed to rename flow:', err);
        } finally {
            setRenaming(false);
        }
    };

    const openDelete = (flow) => {
        setDeleteTarget(flow);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'flows', deleteTarget.id));
            setFlows(prev => prev.filter(f => f.id !== deleteTarget.id));
            setShowDeleteModal(false);
            showSuccess('Flow deleted.');
        } catch (err) {
            console.error('Failed to delete flow:', err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Spinner animation="border" variant="secondary" />
        </div>
    );

    return (
        <>
            {/* Rename modal */}
            <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 500 }}>Rename flow</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        autoFocus
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowRenameModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRename} disabled={!newName.trim() || renaming}>
                        {renaming ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 500 }}>Delete flow</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="py-4" style={{ maxWidth: 960, margin: '0 auto' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 style={{ fontWeight: 500, fontSize: '1.6rem', margin: 0 }}>My flows</h1>
                    <Button variant="primary" size="sm" onClick={() => navigate('/create')}>
                        + New flow
                    </Button>
                </div>

                {flows.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-3">
                        <p className="text-muted mb-3">You haven't saved any flows yet.</p>
                        <Button variant="primary" onClick={() => navigate('/create')}>
                            Create your first flow
                        </Button>
                    </div>
                ) : (
                    <Row className="g-3">
                        {flows.map(flow => (
                            <Col xs={12} sm={6} lg={4} key={flow.id}>
                                <Card className="h-100 border" style={{ borderRadius: 12 }}>
                                    {/* Pose image strip preview */}
                                    <div className="d-flex gap-1 p-2 overflow-auto" style={{
                                        background: '#f8f9fa',
                                        borderRadius: '12px 12px 0 0',
                                        height: 72
                                    }}>
                                        {flow.poses.slice(0, 5).map((pose, i) => (
                                            <img
                                                key={i}
                                                src={pose.imageUrl}
                                                alt={pose.name}
                                                style={{
                                                    width: 52, height: 52,
                                                    objectFit: 'cover',
                                                    borderRadius: 6,
                                                    flexShrink: 0
                                                }}
                                            />
                                        ))}
                                        {flow.poses.length > 5 && (
                                            <div style={{
                                                width: 52, height: 52, borderRadius: 6,
                                                background: '#e9ecef', flexShrink: 0,
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 11, color: '#6c757d'
                                            }}>
                                                +{flow.poses.length - 5}
                                            </div>
                                        )}
                                    </div>

                                    <Card.Body className="d-flex flex-column p-3">
                                        <Card.Title style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: 2 }}>
                                            {flow.name}
                                        </Card.Title>
                                        <p className="text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                                            {flow.poses.length} {flow.poses.length === 1 ? 'pose' : 'poses'}
                                        </p>
                                        <div className="d-flex gap-2 mt-auto">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => navigate(`/create`, { state: { flow } })}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => openRename(flow)}
                                            >
                                                Rename
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => openDelete(flow)}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="flex-grow-1"
                                                onClick={() => setViewFlow(flow)}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
            <Modal
                show={!!viewFlow}
                onHide={() => setViewFlow(null)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        {viewFlow?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                        {viewFlow?.poses.length} {viewFlow?.poses.length === 1 ? 'pose' : 'poses'}
                    </p>
                    <Row className="g-3">
                        {viewFlow?.poses.map((pose, i) => (
                            <Col xs={6} md={4} key={i}>
                                <div className="d-flex gap-2 align-items-center p-2 border rounded-3">
                                    <span style={{
                                        minWidth: 22, height: 22, borderRadius: '50%',
                                        background: '#EEEDFE', color: '#3C3489',
                                        fontSize: 11, fontWeight: 500,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {i + 1}
                                    </span>
                                    <img
                                        src={pose.imageUrl}
                                        alt={pose.name}
                                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                                    />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {pose.name}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#6c757d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {pose.sanskrit}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setViewFlow(null)}>Close</Button>
                    <Button variant="primary" onClick={() => { setViewFlow(null); navigate(`/create`, { state: { flow: viewFlow } }); }}>
                        Edit flow
                    </Button>
                </Modal.Footer>
            </Modal>
            <SuccessToast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
        </>
    );
}