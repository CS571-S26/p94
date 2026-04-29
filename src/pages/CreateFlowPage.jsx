import { Button, Container, Modal } from 'react-bootstrap';
import { useState } from 'react';
import FlowStrip from '../components/FlowStrip.jsx';
import SaveFlowModal from '../components/SaveFlowModal.jsx';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'
import { useLocation } from 'react-router-dom';
import PoseBrowser from '../components/PoseBrowser.jsx';
import CreateFlowHelp from '../components/CreateFlowHelp.jsx';
import SuccessToast from '../components/SuccessToast.jsx';
import { useNavigate } from 'react-router-dom';

export default function CreateFlowPage() {
    
    const location = useLocation();
    const editingFlow = location.state?.flow ?? null;
    const [flow, setFlow] = useState(
        editingFlow
            ? editingFlow.poses.map(pose => ({ id: crypto.randomUUID(), ...pose }))
            : []
    );

    const [user] = useAuthState(auth);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const navigate = useNavigate();


    const showSuccess = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    // flow creation functions:
    const addPose = (pose) => {
        setFlow(prev => [...prev, { id: crypto.randomUUID(), ...pose }]);
    };

    const removePose = (id) => {
        setFlow(prev => prev.filter(p => p.id !== id));
    };

    const reorderFlow = (newFlow) => {
        setFlow(newFlow);
    };

    const handleSave = async (flowName) => {
        if (!user) return;
        setIsSaving(true);
        try {
            if (editingFlow) {
                // overwrite existing document
                await updateDoc(doc(db, 'users', user.uid, 'flows', editingFlow.id), {
                    name: flowName,
                    poses: flow.map(({ id, ...pose }) => pose),
                });
            } else {
                await addDoc(collection(db, 'users', user.uid, 'flows'), {
                    name: flowName,
                    poses: flow.map(({ id, ...pose }) => pose),
                    createdAt: serverTimestamp(),
                });
            }
            setFlow([]);
            setShowModal(false);
            showSuccess(editingFlow ? 'Flow updated successfully!' : 'Flow saved successfully!');
            if (editingFlow) {
                setTimeout(() => navigate('/my-flows'), 1500);
            } else {
                setFlow([]);
            }
        } catch (err) {
            console.error('Failed to save flow:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
    <>
        <SuccessToast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />    
        <SaveFlowModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            isSaving={isSaving}
            initialName={editingFlow?.name ?? ''}
        />

        <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 style={{ fontWeight: 500, fontSize: '1.6rem', margin: 0 }}>Create flow</h1>
            <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowHelp(true)}
                style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, fontWeight: 500 }}
            >
                ?
            </Button>
        </div>
            {/* Flow panel */}
            <div className="bg-light rounded-3 p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="text-uppercase text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Your flow</div>
                        <div style={{ fontWeight: 500 }}>{flow.length} {flow.length === 1 ? 'pose' : 'poses'}</div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setShowClearConfirm(true)}>
                            Clear
                        </Button>
                        <Button variant="primary" size="sm" disabled={flow.length === 0} onClick={() => setShowModal(true)}>
                            Save flow
                        </Button>
                    </div>
                </div>
                <FlowStrip flow={flow} onReorder={reorderFlow} onRemove={removePose} />
            </div>

            <PoseBrowser onAdd={addPose} />
        </Container>
        <CreateFlowHelp show={showHelp} onClose={() => setShowHelp(false)} />
        <Modal show={showClearConfirm} onHide={() => setShowClearConfirm(false)} centered size="sm">
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 500 }}>Clear flow</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to clear your entire flow? This cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={() => setShowClearConfirm(false)}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => { setFlow([]); setShowClearConfirm(false); }}>
                    Clear flow
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}