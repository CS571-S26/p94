import poses from '../data/poses.json';
import { Button, Container, Toast, ToastContainer } from 'react-bootstrap';
import { useState } from 'react';
import FlowStrip from '../components/FlowStrip.jsx';
import SaveFlowModal from '../components/SaveFlowModal.jsx';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'
import { useLocation } from 'react-router-dom';
import PoseBrowser from '../components/PoseBrowser.jsx';


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
            setShowToast(true);
        } catch (err) {
            console.error('Failed to save flow:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
    <>
         {/* Toast — sits in corner */}
        <ToastContainer position="bottom-end" className="p-3">
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                bg="success"
            >
                <Toast.Body className="text-white">
                    Flow saved successfully!
                </Toast.Body>
            </Toast>
        </ToastContainer>
         <SaveFlowModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            isSaving={isSaving}
            initialName={editingFlow?.name ?? ''}
        />

        <Container className="py-4">
            <h1 className="mb-4" style={{ fontWeight: 500, fontSize: '1.6rem' }}>Create flow</h1>

            {/* Flow panel */}
            <div className="bg-light rounded-3 p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="text-uppercase text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Your flow</div>
                        <div style={{ fontWeight: 500 }}>{flow.length} {flow.length === 1 ? 'pose' : 'poses'}</div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => setFlow([])}>Clear</Button>
                        <Button variant="primary" size="sm" disabled={flow.length === 0} onClick={() => setShowModal(true)}>
                            Save flow
                        </Button>
                    </div>
                </div>
                <FlowStrip flow={flow} onReorder={reorderFlow} onRemove={removePose} />
            </div>

            <PoseBrowser onAdd={addPose} />
        </Container>
    </>
    );
}