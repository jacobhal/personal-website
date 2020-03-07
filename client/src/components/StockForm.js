
import React from 'react';

const StockForm = props => {
    return (
    <form id={props.formId} onSubmit={props.handleSubmitFunc}>
        <div className="field">
            <div className="control">
                <input
                    className="input"
                    type="text"
                    id={props.inputId}
                    placeholder={props.placeholder}
                    onChange={props.onChangeFunc}
                />
            </div>
        </div>

        <div className="field">
            <div className="control">
                <button className="button" type="submit">{props.buttonValue}</button>
            </div>
        </div>
    </form>
    );
}

export default StockForm;