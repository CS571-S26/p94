import poses from '../data/poses.json';
import PoseCard from './PoseCard.jsx';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState, useMemo } from 'react';

const CATEGORIES = [...new Set(poses.map(p => p.category))].sort();
const DIFFICULTIES = [...new Set(poses.map(p => p.difficulty))].sort();

export default function PoseBrowser({ onAdd }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [committedSearch, setCommittedSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setCommittedSearch(searchTerm);
    };

    const handleReset = () => {
        setSearchTerm('');
        setCommittedSearch('');
        setFilterCategory('');
        setFilterDifficulty('');
    };

    const filteredPoses = useMemo(() => poses.filter(pose => {
        const matchesSearch =
            pose.name.toLowerCase().includes(committedSearch.toLowerCase()) ||
            pose.sanskrit.toLowerCase().includes(committedSearch.toLowerCase());
        const matchesCategory = filterCategory ? pose.category === filterCategory : true;
        const matchesDifficulty = filterDifficulty ? pose.difficulty === filterDifficulty : true;
        return matchesSearch && matchesCategory && matchesDifficulty;
    }), [committedSearch, filterCategory, filterDifficulty]);

    return (
        <>
            <Form onSubmit={handleSubmit} className="mb-4">
                <div className="d-flex gap-2 mb-2">
                    <Form.Control
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
                        <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="">All categories</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
                            <option value="">All difficulties</option>
                            {DIFFICULTIES.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
            </Form>

            <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                {filteredPoses.length === 0
                    ? 'No poses found.'
                    : `Showing ${filteredPoses.length} pose${filteredPoses.length === 1 ? '' : 's'}`}
            </p>

            <Row className="g-3">
                {filteredPoses.map((pose, index) => (
                    <Col xs={12} md={6} lg={4} xl={3} key={index}>
                        <PoseCard pose={pose} onAdd={onAdd} />
                    </Col>
                ))}
            </Row>
        </>
    );
}