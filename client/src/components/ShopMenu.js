import React from 'react';
import { getCategories } from '../actions';
import { connect } from 'react-redux';
import { changeString } from '../js/index';

function CategoryItem({category, ID}) {

    let newString = changeString(category.name);
    if(ID===category.ID) {
        return (
            <li className="categories-list-item">
                <div className="category-selected">{category.name}</div>
            </li>
        )
    } else {
    return (
        <li className="categories-list-item">
            <a href={`/sklep/c/${newString}/${category.ID}`}>{category.name}</a>
        </li>
    )
    }
}

function CategoriesList({categories, categoryId}) {
    return categories.map( category => <CategoryItem category={category} key={category._id} ID={categoryId}/>)
   }

class ShopMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state={}
    }

    componentDidMount = async () => {
        await this.props.getCategories();
    }
    render() {
        return(
            <div className="categories-list-container">
                <div className="categories-list-header">Menu:</div>
                <ul className="categories-list">
                <CategoriesList categories={this.props.categories} categoryId={this.props.categoryId}/>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { categories: state.categories };
};
export default connect(
    mapStateToProps,
    { getCategories }
)(ShopMenu);