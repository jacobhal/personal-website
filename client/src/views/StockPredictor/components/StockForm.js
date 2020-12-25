import React from 'react'

import { Form, Button } from 'react-bootstrap'

const StockForm = React.forwardRef((props, ref) => (
    <Form id={props.formId} onSubmit={props.handleSubmitFunc}>
        <Form.Group controlId={props.inputId}>
            <Form.Label>Stock symbol</Form.Label>
            <Form.Control
                className="input"
                type="text"
                placeholder={props.placeholder}
                onChange={props.onChangeFunc}
                // ref={ref}
                autoFocus
                required
            />
        </Form.Group>

        <Button variant="primary" type="submit">
            {props.buttonValue}
        </Button>
    </Form>
))

export default StockForm
