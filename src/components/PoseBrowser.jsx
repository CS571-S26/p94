import poses from '../data/poses.json';
import PoseCard from './PoseCard.jsx';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState, useMemo } from 'react';

const CATEGORIES = [...new Set(poses.map(p => p.category))].sort();
const DIFFICULTIES = [...new Set(poses.map(p => p.difficulty))].sort();

export default function PoseBrowser({ onAdd }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [committed, setCommitted] = useState({
        searchTerm: '',
        filterCategory: '',
        filterDifficulty: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setCommitted({ searchTerm, filterCategory, filterDifficulty });
    };

    const handleReset = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterDifficulty('');
        setCommitted({ searchTerm: '', filterCategory: '', filterDifficulty: '' });
    };

    const filteredPoses = useMemo(() => poses.filter(pose => {
        const matchesSearch =
            pose.name.toLowerCase().includes(committed.searchTerm.toLowerCase()) ||
            pose.sanskrit.toLowerCase().includes(committed.searchTerm.toLowerCase());
        const matchesCategory = committed.filterCategory ? pose.category === committed.filterCategory : true;
        const matchesDifficulty = committed.filterDifficulty ? pose.difficulty === committed.filterDifficulty : true;
        return matchesSearch && matchesCategory && matchesDifficulty;
    }), [committed]);

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