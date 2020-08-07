import React from 'react';
import { connect } from 'react-redux';
import { getSitesByCategory } from '../actions';
import { changeString } from '../js/index';

class Footer extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            regs: [],
            shop: [],
            comp: [],
            loaded: false
        }
    }
    componentDidMount = async () => {
        let a = "Regulaminy"
        await this.props.getSitesByCategory(a);
        await this.setState({regs: this.props.sites})
        await this.props.getSitesByCategory("Zakupy");
        await this.setState({shop: this.props.sites})
        await this.props.getSitesByCategory("O firmie");
        await this.setState({comp: this.props.sites})
        this.setState({loaded: true})

    }

    renderSitesReg = () => {

        return this.state.regs.map(element => {
            let newString = changeString(element.name);
            return <a className="footer-site" href={`/sklep/s/${newString}/${element.ID}`}>{element.name}</a>
        })
    }

    renderSitesZak = () => {

        return this.state.shop.map(element => {
            let newString = changeString(element.name);
            return <a className="footer-site" href={`/sklep/s/${newString}/${element.ID}`}>{element.name}</a>
        })
    }

    renderSitesFir = () => {

        return this.state.comp.map(element => {
            let newString = changeString(element.name);
            return <a className="footer-site" href={`/sklep/s/${newString}/${element.ID}`}>{element.name}</a>
        })
    }



    render() {

        const renderFooter = (
            <><div className="footer-sites-container">
                <div className="footer-sites-category">
                    <h4>Regulaminy</h4>
                    {this.renderSitesReg()}
                   
                </div>
                <div className="footer-sites-category">
                    <h4>Zakupy</h4>
                    {this.renderSitesZak()}
                    
                </div>
                <div className="footer-sites-category">
                    <h4>O firmie</h4>
                    <a className="footer-site" href="/kontakt">Kontakt</a>
                    <a className="footer-site" href="/o-mnie">O mnie</a>
                    {this.renderSitesFir()}

                </div>
            </div>
            <div className="footer-container">
                <div className="footer-item">© Kamil Zasada 2020</div>
            </div></>
        )
        return(
            <>{this.state.loaded ? renderFooter : null}</>
        )
    }
}

const mapStateToProps = state => {
    return { sites: state.sites };
};
export default connect(
    mapStateToProps,
    { getSitesByCategory}
)(Footer);