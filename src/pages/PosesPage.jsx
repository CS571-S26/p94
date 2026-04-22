import { Container } from 'react-bootstrap';
import PoseBrowser from '../components/PoseBrowser.jsx';

export default function PosesPage() {
    return (
        <Container className="py-4">
            <h1 className="mb-1" style={{ fontWeight: 500, fontSize: '1.6rem' }}>Poses</h1>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                Browse our full library of yoga poses.
            </p>
            <PoseBrowser />
        </Container>
    );
}