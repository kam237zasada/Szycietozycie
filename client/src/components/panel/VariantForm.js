import React from 'react';
import { connect } from 'react-redux';
import { addVariant, getVariant, updateVariant, deleteVariant } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js/index';

class VariantForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            ID: '',
            name: '',
            currentValues:[],
            values: [],
            error: '',
            update: false,
            emptyError: '',
            loaded: false
        }
    }

    componentDidMount = async () => {
        const jwt = getCookie("jwt")
        if(this.props.match.params.id) {
            try {
                await this.props.getVariant(this.props.match.params.id, jwt);
                this.setState({name: this.props.variant.name})
                this.setState({ID: this.props.variant.ID})
                this.setState({currentValues: this.props.variant.values});
                this.setState({_id: this.props.variant._id})
                this.setState({update: true})
                await this.setState({loaded: true});
                this.renderValues();
            } catch (err) {
                this.setState({error: "Wystąpił nieoczekiwany błąd"});
            }
        }
        this.setState({loaded: true});

    }
    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            default:
                break;
        }
    };

    handleChangeValue = async event => {
        let currentValuesLength = this.state.currentValues.length;
        let parentDiv = document.getElementById("values");
        let childCollection = parentDiv.children;
        let whichChild;
        for(let i=0; i<childCollection.length; i++) {
            if(event.target.name==childCollection[i].attributes.id.value) {
                whichChild = i;
            }
        }
        let index = whichChild - currentValuesLength
        if(index > -1) {
        let values = this.state.values;
        values[index] = event.target.value;
        } else {
            index = whichChild
            let currentValues = this.state.currentValues;
            currentValues[index] = event.target.value;
            this.setState({currentValues: currentValues})
   }
    }


    handleSubmit = async event => {
        event.preventDefault();
        const jwt = getCookie("jwt")
        try {
        const {name, values} = this.state;
        if(values.includes(undefined) || values.length==0 || values.includes("")) {
            return this.setState({emptyError: "Każde dodane pole musi zostać wypełnione"})
        }
        await this.props.addVariant(name, values, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }

    handleUpdate = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        let array = this.state.currentValues.concat(this.state.values);
        try {
            if(array.includes(undefined) || array.length==0 || array.includes("")) {
                return this.setState({emptyError: "Każde dodane pole musi zostać wypełnione"})
            }
            await this.props.updateVariant(this.state._id, this.state.name, array, jwt);
            this.setState({isAdded: true})
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }

    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        try {
            await this.props.deleteVariant(this.state._id, this.state.ID, jwt);
            this.setState({isAdded: true})
        } catch (err) {
            this.setState({error: err.response.data});
        }
    }

    handleAddValue = e => {
        e.preventDefault();
        let index;
        let parent = document.getElementById("values");
        if (parent.children.length === 0) {
            index = 0
        } else {
        let lastChild = parent.lastElementChild;
        let array = lastChild.id.split('-');
        let string = array[1]
        index = parseInt(string);
        index += 1;
        }
        let div = document.createElement("div");
        div.setAttribute("id", `value-${index}`)
        div.setAttribute("class", "flex")
        let value = document.createElement("input");
        value.setAttribute("type", "text");
        value.setAttribute("name", `value-${index}`);
        value.addEventListener("change", this.handleChangeValue);
        let button = document.createElement("button");
        button.setAttribute("class", "panel-button red");
        button.setAttribute("name", `value-${index}`)
        button.innerText="USUŃ"
        button.style.height = "100%"
        button.addEventListener("click", this.handleDeleteValue);
        div.appendChild(value);
        div.appendChild(button);
        parent.appendChild(div);
    }

    handleDeleteValue = e => {
        e.preventDefault(); 
        let currentValuesLength = this.state.currentValues.length;
        let parentDiv = document.getElementById("values");
        let childCollection = parentDiv.children;
        let whichChild;
        for(let i=0; i<childCollection.length; i++) {
            if(e.target.name===childCollection[i].attributes.id.value) {
                whichChild = i;
            }
        }
        let index = whichChild - currentValuesLength
        let array = e.target.name.split('-');
        let valueNumber = array[1];
        if(index > -1) {
            
        let values= this.state.values;
        values.splice(index, 1);
        } else {
            index = whichChild;
            let currentValues = this.state.currentValues;
            currentValues.splice(index, 1)
        }
        let div = document.getElementById(`value-${valueNumber}`)
        div.remove();

        
    }

    renderValues = () => {
        
        return this.state.currentValues.map((value, index)  => {
            
                let parentDiv = document.getElementById("values");
                let div = document.createElement("div");
                div.setAttribute("class", "flex");
                div.setAttribute("id", `value-${index}`);
                let input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("name", `value-${index}`);
                input.setAttribute("value", value);
                input.addEventListener("change", this.handleChangeValue);
                div.appendChild(input);
                let button = document.createElement("button");
                button.style.height = "100%";
                button.setAttribute("class", "panel-button red");
                button.setAttribute("name", `value-${index}`);
                button.addEventListener("click", this.handleDeleteValue);
                button.innerHTML = "USUŃ";
                div.appendChild(button);
                parentDiv.appendChild(div);
        });
        
    }
    render() {


        
        const newVariant = (
            
                        <div id="value-0"><input
                        type="text"
                        name="value-0"
                        onChange={this.handleChangeValue}
                        required></input></div>     
        )
        
        const updateButtons = (
            <><button className="panel-button" form="handleVariant" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" form="handleVariant" onClick={this.handleDelete}>Usuń</button></>
        )
         
        const renderForm = (
            <div className="ui form">
                <form id="handleVariant">
                    <label>Dodaj nowy wariant:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div>
                    <div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <label>Wartości</label>
                    <div id="values" className="field values-field">
                    {this.state.update ?  <></> : newVariant}
                        
                    </div>
                    <button onClick={this.handleAddValue} className="panel-button">dodaj parametr wariantu</button>
                    </div>
                    <label className="error-message">{this.state.error}</label><br/>
                    <label className="error-message">{this.state.emptyError}</label>
                    {this.state.update ? updateButtons : <button className="panel-button" form="handleVariant" onClick={this.handleSubmit}>Dodaj</button>}
                    
                </form>
            </div>
        )

        const loaded = (
            <div>{this.state.isAdded ? <Redirect push to="/admin/variants"/> : renderForm}</div>
        )
        return <>{this.state.loaded ? loaded : "Wczytywanie"}</>

    }
}

const mapStateToProps = (state) => {
    return { variant: state.variant };

};

export default connect(
    mapStateToProps,
    { addVariant, getVariant, updateVariant, deleteVariant }
    )(VariantForm);