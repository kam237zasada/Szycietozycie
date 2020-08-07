import React from 'react';
import ContentEditable from 'react-contenteditable'
import { connect } from 'react-redux';
import { getSite, addSite, updateSite, deleteSite } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js/index';

class NewSiteForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            content: '',
            category: '',
            update: false,
            loaded: false,
            isAdded: false,
            error:''
        }
    }

    componentDidMount = async () => {
        if(this.props.match.params.id) {
        await this.props.getSite(this.props.match.params.id);
        this.setState({name: this.props.site.name});
        this.setState({_id: this.props.site._id});
        this.setState({category: this.props.site.category});
        this.setState({content: this.props.site.content});
        this.setState({update: true});
        }
        this.setState({loaded: true})
    }
    
    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'content':
                this.setState({ content: event.target.value});
                break;
            case 'category':
                this.setState({category: event.target.value});
                break;
            default:
                break;
        }
    };

    handleChangeContent = event => {
        this.setState({content: event.target.value})
    }

    handleSubmit = async event => {
        const jwt = getCookie("jwt")
        event.preventDefault();
        try {
        const {name, category, content} = this.state;
        await this.props.addSite(name, content, category, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }

    handleUpdate = async (e) => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        const {_id, name, content, category} = this.state;
        try {
        await this.props.updateSite(_id, name, content, category, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
        }
    }
    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        try {
        await this.props.deleteSite(this.state._id, jwt);
        this.setState({isAdded: true});
        } catch(err) {
            this.setState({error: err.response.data})
        }
    }

    executeCmdWithArg = (event) => {
        event.preventDefault();
        if(event.target.id==="createLink") {
            let URL = window.prompt("Proszę podać adres URL do linku", "http://przykładowyadres.pl")
            document.execCommand(event.target.id, false, URL)

        }
        document.execCommand(event.target.id, false, event.target.value)
    }

    executeCmd = (event) => {
        event.preventDefault();
        document.execCommand(event.target.id, false, null)
    }

    renderCategories = () => {
        let array = ["Regulaminy", "Zakupy", "O firmie"];

        return array.map(element => {
            if(element===this.state.category) {
                return <option value={element} selected>{element}</option>
            } else {
                return <option value={element}>{element}</option>
            }
        })
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="siteForm">
                {this.state.update ? <label>Edytuj strone informacyjną:</label> : <label>Dodaj nową stronę informacyjną:</label>}
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div>
                    <div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        placeholder=""
                        value={this.state.name}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Kategoria</label>
                        <select
                        name="category"
                        onChange={this.handleChange}
                        required>
                            <option value="">Wybierz z listy</option>
                            {this.renderCategories()}
                        </select>
                    </div>
                    
                    <div className="text-editor-container">
                    <div className="text-editor-header">
                    <i id="bold" onClick={this.executeCmd} className="fas fa-bold description-icon"></i>
                    <i id="italic" onClick={this.executeCmd} className="fas fa-italic description-icon"></i>
                    <i id="underline" onClick={this.executeCmd} className="fas fa-underline description-icon"></i>
                    <i id="justifyLeft" onClick={this.executeCmd} className="fas fa-align-left description-icon"></i>
                    <i id="justifyCenter" onClick={this.executeCmd} className="fas fa-align-center description-icon"></i>
                    <i id="justifyRight" onClick={this.executeCmd} className="fas fa-align-right description-icon"></i>
                    <i id="justifyFull" onClick={this.executeCmd} className="fas fa-align-justify description-icon"></i>
                    <i id="strikethrough" onClick={this.executeCmd} className="fas fa-strikethrough description-icon"></i>
                    <i id="createLink" onClick={this.executeCmdWithArg} className="fas fa-link description-icon"></i>
                    <i id="subscript" onClick={this.executeCmd} className="fas fa-subscript description-icon"></i>
                    <i id="superscript" onClick={this.executeCmd} className="fas fa-superscript description-icon"></i>
                    <i id="undo" onClick={this.executeCmd} className="fas fa-undo description-icon"></i>
                    <i id="redo" onClick={this.executeCmd} className="fas fa-redo description-icon"></i>
                    <i id="insertUnorderedList" onClick={this.executeCmd} className="fas fa-list-ul description-icon"></i>
                    <i id="insertOrderedList" onClick={this.executeCmd} className="fas fa-list-ol description-icon"></i>
                    <i id="insertParagraph" onClick={this.executeCmd} className="fas fa-paragraph description-icon"></i>
                    Kolor tekstu: <input id="foreColor" type="color" onChange={this.executeCmdWithArg}/>
                    <select id="fontSize" onChange={this.executeCmdWithArg}>
                        <option value="" selected disabled hidden>Wielkość czcionki</option>
                        <option value="1">8</option>
                        <option value="2">10</option>
                        <option value="3">12</option>
                        <option value="4">14</option>
                        <option value="5">18</option>
                        <option value="6">24</option>
                        <option value="7">36</option>
                    </select>
                    <select id="fontName" onChange={this.executeCmdWithArg}>
                        <option value="" selected disabled hidden>Krój czcionki</option>
                        <option style={{fontFamily:'Arial'}} value="Arial">Arial</option>
                        <option style={{fontFamily:'Comic Sans MS'}} value="Comic Sans MS">Comic Sans</option>
                        <option style={{fontFamily:'Courier New'}} value="Courier New">Courier New</option>
                        <option style={{fontFamily:'Georgia'}} value="Georgia">Georgia</option>
                        <option style={{fontFamily:'Helvetica'}} value="Helvetica">Helvetica</option>
                        <option style={{fontFamily:'Times New Roman'}} value="Times New Roman">Times New Roman</option>
                        <option style={{fontFamily:'Verdana'}} value="Verdana">Verdana</option>
                    </select>
                    </div>
                    <label><b>Zawartość:</b></label>

                    <ContentEditable
                        className="description-frame"
                        innerRef={this.contentEditable}
                        id="contentFrame"
                        name="content"
                        html={this.state.content}
                        disabled={false}
                        onChange={this.handleChangeContent}
                        tagName=''
                    />                    
                    </div>
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    {this.state.update ? 
                    <><button className="panel-button" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button></>
                    : <button className="panel-button" form="siteForm" onClick={this.handleSubmit}>Dodaj</button>}                </form>
            </div>
        )

        const loading = (
            <>{this.state.loaded ? renderForm : <div>Wczytywanie...</div>}</>

        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/sites"/> : loading}</div>

    }
}

const mapStateToProps = (state) => {
    return { site: state.site };

};

export default connect(
    mapStateToProps,
    { getSite, addSite, updateSite, deleteSite }
    )(NewSiteForm);