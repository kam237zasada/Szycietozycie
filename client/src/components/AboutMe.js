import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { baseURL } from '../api/index'


class AboutMe extends React.Component {

    componentDidMount = () => {
        let head = document.getElementsByTagName("head");
        let title = document.getElementsByTagName("title");
        title[0].innerHTML = "O mnie - Szycie to Życie";
        let description = document.createElement("meta");
        description.setAttribute("name", "description");
        description.setAttribute("content", "Pracownia krawiecka Szycie To Życie.");
        head[0].appendChild(description)

    }

    render() {
        return(
            <div>
                <Header/>
                <div className="about-me-overall">
                <div className="about-me-container">
                    <div className="about-me-item">
                        <img className="about-me-image" src="../my-photo.jpg" alt="my-photo"/>
                        <div className="about-me-div">
                            <h2 className="about-me-header">Sklep Szycie to Życie!</h2>
                        <p className="about-me-paragraph">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fermentum eros vel hendrerit volutpat. Nam sit amet massa ornare, sodales turpis non, accumsan felis. In sit amet dui magna. In tristique diam quis ligula dignissim scelerisque. Duis sed mi vitae tortor feugiat lacinia. In ut mi viverra, iaculis libero at, vestibulum neque. Pellentesque quam purus, efficitur vel congue at, blandit eu risus.  
                            </p>

                            <p className="about-me-paragraph">In scelerisque vulputate erat, vitae viverra dolor tincidunt sit amet. Etiam odio tortor, dictum quis massa ut, accumsan elementum dolor. Nam auctor, urna non dictum luctus, quam orci vestibulum magna, quis viverra dui enim id diam. Proin quis sapien porttitor, maximus est sed, lobortis nisl. Donec condimentum nunc metus, et placerat dui cursus et. Sed id euismod felis. Nulla in quam ut odio gravida auctor id in odio. Cras ac est dictum, vehicula lectus vitae, commodo purus. Curabitur nec dignissim nulla. Mauris pharetra dignissim nisl, in ultricies elit. Nullam quis gravida mi. Quisque nec lectus augue.</p>

                            <p className="about-me-paragraph">Donec suscipit, tortor in vulputate viverra, tortor dolor mollis orci, id molestie justo eros vestibulum orci. Phasellus tempus dignissim eleifend. In hac habitasse platea dictumst. Curabitur finibus nulla ac consectetur viverra. Ut ornare tortor a tempus consectetur. Maecenas est justo, vulputate vitae turpis sit amet, pellentesque volutpat felis.</p>

                            <p className="about-me-paragraph">Zapraszam serdecznie do zapoznania się z moja ofertą w zakładce <a style={{textDecoration:"underline"}} href={`${baseURL}/sklep`}>Sklep</a> oraz z <a style={{textDecoration:"underline"}} href={`${baseURL}/cennik`}>cennikiem usług krawieckich</a>.</p>

                            <p>Zapraszam serdecznie<br/>
                            Szycie To Życie</p>
                            
                        </div>
                    </div>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default AboutMe