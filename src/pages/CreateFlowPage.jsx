import poses from '../data/poses.json';
import PoseCard from '../components/PoseCard.jsx';
import { Row, Col } from 'react-bootstrap';

export default function CreateFlowPage() {


    return <>
        <h1>Create Flow</h1>
        <Row>

            {poses.map((pose, index) => (
                <Col xs={12} md={6} lg={4} xl={3} key={index}>
                <PoseCard key={index} pose={pose} />
                </Col>
            ))}
        </Row>
        {/* - search bar
            - filters
            - pose cards that match search/filter criteria
            
            - when pose is selected, it gets added to end of flow
            - once added, pose can be reordered or deleted*/}
    </>
}