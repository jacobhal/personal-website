import React from 'react'
import { Box, Button, TextField } from '@mui/material'

interface StockFormProps {
    formId: string
    inputId: string
    placeholder: string
    buttonValue: string
    onChangeFunc: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmitFunc: (e: React.FormEvent) => void
}

const StockForm: React.FC<StockFormProps> = (props) => (
    <Box component="form" id={props.formId} onSubmit={props.handleSubmitFunc}>
        <TextField
            id={props.inputId}
            label="Stock symbol"
            type="text"
            placeholder={props.placeholder}
            onChange={props.onChangeFunc}
            autoFocus
            required
            fullWidth
            margin="normal"
        />
        <Button variant="contained" type="submit">
            {props.buttonValue}
        </Button>
    </Box>
)

export default StockForm
