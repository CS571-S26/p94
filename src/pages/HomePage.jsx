import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import poses from '../data/poses.json';
import PoseCard from '../components/PoseCard.jsx';

const SAMPLE_FLOW_NAMES = ["Child's",  "Downward-Facing Dog", "Warrior II", "Extended Side Angle", "Reverse Triangle"]; 

export default function HomePage() {
    const [user] = useAuthState(auth);
    const [recentFlows, setRecentFlows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const fetchFlows = async () => {
            const q = query(
                collection(db, 'users', user.uid, 'flows'),
                orderBy('createdAt', 'desc'),
                limit(3)
            );
            const snapshot = await getDocs(q);
            setRecentFlows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchFlows();
    }, [user]);

    if (!user) return <LoggedOutView />;
    return <LoggedInView user={user} recentFlows={recentFlows} navigate={navigate} />;
}

function LoggedOutView() {
    const navigate = useNavigate();
    const SAMPLE_FLOW = SAMPLE_FLOW_NAMES.map(name => poses.find(p => p.name === name)).filter(Boolean);

    return (
        <Container className="py-5">
            {/* Hero */}
            <div className="text-center mb-5">
                <h1 className="mb-1" style={{fontWeight: 500, fontSize: '2.5rem' }}>
                  Welcome to FlowState!
                </h1>
                <h1 style={{ fontWeight: 500, fontSize: '1.6rem' }}>Design your perfect yoga flow</h1>
                <p className="text-muted mb-4">Browse poses, build sequences, and save flows to practice anytime.</p>
                <div className="d-flex justify-content-center gap-2">
                    <Button variant="primary" onClick={() => navigate('/register')}>Get started</Button>
                    <Button variant="outline-secondary" onClick={() => navigate('/login')}>Log in</Button>
                </div>
            </div>

            {/* Sample flow strip */}
            <div className="bg-light rounded-3 p-3 mb-4">
                <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>Sample flow</p>
                <div className="d-flex gap-2 align-items-center overflow-auto pb-1">
                    {SAMPLE_FLOW.map((pose, i) => (
                    <div key={pose.name} className="d-flex align-items-center">
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 4, padding: '8px', width: 70, flexShrink: 0,
                            background: 'white', border: '0.5px solid #dee2e6', borderRadius: 8
                        }}>
                            <img src={pose.imageUrl} alt={pose.name}
                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 5 }} />
                            <span style={{ fontSize: 9, textAlign: 'center', color: '#6c757d' }}>{pose.name}</span>
                        </div>

                        {i < SAMPLE_FLOW.length - 1 && (
                            <span style={{ color: '#adb5bd', fontSize: 18, margin: '0 4px' }}>›</span>
                        )}
                    </div>
                ))}
                </div>
            </div>

            {/* Pose preview */}
            <p className="text-center text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                Browse from {poses.length}+ poses
            </p>
           
            <Row className="g-3 mb-4">
                {poses.slice(0, 4).map((pose, i) => (
                    <Col xs={6} md={3} key={i}>
                        <PoseCard pose={pose} />
                    </Col>
                ))}
            </Row>

            {/* CTA */}
            <div className="bg-light rounded-3 p-4 text-center">
                <p className="text-muted mb-3">Sign up to build and save your own flows</p>
                <Button variant="primary" onClick={() => navigate('/register')}>
                    Create a free account
                </Button>
            </div>
        </Container>
    );
}

function LoggedInView({ user, recentFlows, navigate }) {

    return (
        <Container className="py-4">
            <h1 className="mb-1" style={{ fontWeight: 500, fontSize: '1.6rem' }}>
                Welcome to FlowState!
            </h1>
            <p className="text-muted mb-4">Ready to build something new?</p>

            {/* Quick actions */}
            <Row className="g-3 mb-4">
                <Col xs={12} md={6}>
                    <div className="p-3 rounded-3 border h-100" style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/create')}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: '#EEEDFE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, marginBottom: 10
                        }}>+</div>
                        <div style={{ fontWeight: 500, marginBottom: 3 }}>Create a flow</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            Build a new sequence from the pose library
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <div className="p-3 rounded-3 border h-100" style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/my-flows')}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: '#E1F5EE', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, marginBottom: 10
                        }}>☰</div>
                        <div style={{ fontWeight: 500, marginBottom: 3 }}>My flows</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            View and edit your saved sequences
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Recent flows */}
            <h2 className="mb-3" style={{ fontWeight: 500, fontSize: '1rem' }}>Recent flows</h2>
            {recentFlows.length === 0 ? (
                <div className="bg-light rounded-3 p-4 text-center">
                    <p className="text-muted mb-3">No flows saved yet</p>
                    <Button variant="primary" size="sm" onClick={() => navigate('/create')}>
                        Create your first flow
                    </Button>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {recentFlows.map(flow => (
                        <div key={flow.id} className="d-flex justify-content-between align-items-center p-3 border rounded-3">
                            <div>
                                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{flow.name}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    {flow.poses.length} {flow.poses.length === 1 ? 'pose' : 'poses'}
                                </div>
                            </div>
                            <Button variant="outline-secondary" size="sm"
                                onClick={() => navigate(`/my-flows/`, { state: { openFlow: flow } })}>
                                View
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
}