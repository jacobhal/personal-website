
import React from 'react';

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
                />
            </div>
        </div>

        <div className="field">
            <div className="control">
                <button className="button" type="submit">{props.buttonValue}</button>
            </div>
        </div>
    </form>
));

export default StockForm;