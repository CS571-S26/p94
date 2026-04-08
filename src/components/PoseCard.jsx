import { Card, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function PoseCard(props) {

    const [expanded, setExpanded] = useState(false);
    const shortDescription = props.pose.description.length > 100 ? props.pose.description.substring(0, 100) + "..." : props.pose.description;

    return <Card style={{ width: '20rem' }}>
        <Card.Img variant="top" src={`${props.pose.imageUrl}`} />
        <Card.Body>
            <Card.Title>{`${props.pose.name} (${props.pose.sanskrit})`}</Card.Title>
            <p style={{ fontStyle: 'italic' }}>{props.pose.category}</p>
            <p style={{ fontWeight: 'bold' }}>Difficulty: {props.pose.difficulty}</p>

            <p>{expanded ? props.pose.description : shortDescription}</p>
            {props.pose.description.length > 100 && (
            <Button
                variant="link"
                style={{ padding: 0 }}
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Collapse Description" : "Expand Description"}
            </Button>
            )}
        </Card.Body>
    </Card>

}