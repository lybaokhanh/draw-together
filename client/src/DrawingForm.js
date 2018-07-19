import React, { Component } from 'react';

import { createDrawing } from './api';

class DrawingForm extends Component {
    state = {
        drawingName: '',
    };

    handleSubmit = (event) => {
        event.preventDefault();
        createDrawing(this.state.drawingName);
        this.setState({ drawingName: '' });
    }

    render() {
        return (
            <div className="Form">
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        value={this.state.drawingName}
                        onChange={(event) => this.setState({
                            drawingName: event.target.value,
                        })}
                        placeholder="Drawing name"
                        className="Form-drawingInput"
                    />
                    <button
                        type="submit"
                        className="Form-drawingInput"
                    >
                        Create
                    </button>
                </form>
            </div>
        )
    }
}

export default DrawingForm;
