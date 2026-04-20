import { Card, Button, Badge } from 'react-bootstrap';
import { useState } from 'react';

export default function PoseCard(props) {

    const [expanded, setExpanded] = useState(false);
    const shortDescription = props.pose.description.length > 100 ? props.pose.description.substring(0, 100) + "..." : props.pose.description;

    return <Card className="h-100 border" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Card.Img 
            variant="top" 
            src={`${props.pose.imageUrl}`} 
            alt={props.pose.name}
            style={{ aspectRatio: '1', objectFit: 'cover' }}/>
        <Card.Body className="d-flex flex-column p-3">
            <Card.Title style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '2px' }}>
                {props.pose.name}
            </Card.Title>
            <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>{props.pose.sanskrit}</p>
            <div className="d-flex gap-1 mb-3">
                <Badge bg="light" text="dark" style={{ fontSize: '0.7rem', border: '0.5px solid #dee2e6' }}>
                    {props.pose.category}
                </Badge>
                <Badge bg="light" text="dark" style={{ fontSize: '0.7rem', border: '0.5px solid #dee2e6' }}>
                    {props.pose.difficulty}
                </Badge>
            </div>
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
            {props.onAdd && (
                <Button variant="outline-primary" size="sm" className="mt-auto w-100" onClick={() => props.onAdd(pose)}>
                    + Add to flow
                </Button>
            )}
        </Card.Body>
    </Card>

}