import React from 'react'

const StockForm = React.forwardRef((props, ref) => (
    <form id={props.formId} onSubmit={props.handleSubmitFunc}>
        <div className="field">
            <div className="control">
                <input
                    className="input"
                    type="text"
                    id={props.inputId}
                    placeholder={props.placeholder}
                    onChange={props.onChangeFunc}
                    // ref={ref}
                    autoFocus
                    required
                />
            </div>
        </div>

        <div className="field">
            <div className="control">
                <button className="btn btn-primary" type="submit">
                    {props.buttonValue}
                </button>
            </div>
        </div>
    </form>
))

export default StockForm
