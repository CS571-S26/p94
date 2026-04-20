import '../App.css'
import { Button, Card } from 'react-bootstrap'

export default function MyFlowsPage() {

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
      <Card className='m-4 p-2'>
        <Card.Body className='text-center'>
          <h1>Welcome to FlowState!</h1>
          <h4>Log in or Register to begin creating.</h4>
        </Card.Body>
      </Card>
    </div>
  )
}