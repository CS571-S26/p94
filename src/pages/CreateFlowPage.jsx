import poses from '../data/poses.json';
import PoseCard from '../components/PoseCard.jsx';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { useState } from 'react';
import FlowStrip from '../components/FlowStrip.jsx';


const CATEGORIES = [...new Set(poses.map(p => p.category))].sort();
const DIFFICULTIES = [...new Set(poses.map(p => p.difficulty))].sort();

export default function CreateFlowPage() {

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("");
    const [flow, setFlow] = useState([]);

    const [committed, setCommitted] = useState({
        searchTerm: "",
        filterCategory: "",
        filterDifficulty: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setCommitted({ searchTerm, filterCategory, filterDifficulty });
    };

    const handleReset = () => {
        setSearchTerm("");
        setFilterCategory("");
        setFilterDifficulty("");
        setCommitted({ searchTerm: "", filterCategory: "", filterDifficulty: "" });
    };

    const filteredPoses = poses.filter(pose => {
        const matchesSearch = pose.name.toLowerCase().includes(committed.searchTerm.toLowerCase())
            || pose.sanskrit.toLowerCase().includes(committed.searchTerm.toLowerCase());
        const matchesCategory = committed.filterCategory ? pose.category === committed.filterCategory : true;
        const matchesDifficulty = committed.filterDifficulty ? pose.difficulty === committed.filterDifficulty : true;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

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

    return <Container className="py-4">
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
                    <Button variant="primary" size="sm" disabled={flow.length === 0}>Save flow</Button>
                </div>
            </div>
            <FlowStrip flow={flow} onReorder={reorderFlow} onRemove={removePose} />
        </div>
        {/* Search & filters */}
        <Form onSubmit={handleSubmit} className="mb-4">
            <div className="d-flex gap-2 mb-2">
                <Form.Control
                    id="search"
                    type="text"
                    placeholder="Search by name or Sanskrit name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">Search</Button>
                <Button variant="outline-secondary" type="button" onClick={handleReset}>Reset</Button>
            </div>
            <Row className="g-2">
                <Col>
                    <Form.Select id="category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="">All categories</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select id="difficulty" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
                        <option value="">All difficulties</option>
                        {DIFFICULTIES.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                    </Form.Select>
                </Col>
            </Row>
        </Form>

        {/* Results */}
        <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
            {filteredPoses.length === 0 ? 'No poses found.' : `Showing ${filteredPoses.length} pose${filteredPoses.length === 1 ? '' : 's'}`}
        </p>
        <Row className="g-3">
            {filteredPoses.map((pose, index) => (
                <Col xs={12} md={6} lg={4} xl={3} key={index}>
                    <PoseCard pose={pose} onAdd={addPose} />
                </Col>
            ))}
        </Row>
    </Container>
}