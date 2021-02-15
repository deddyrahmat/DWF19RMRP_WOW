import React, {Fragment, useContext, useEffect, useState} from 'react';
import { Row,Col, Container, Alert } from 'react-bootstrap';
import {
    // BrowserRouter as Router,
    Switch,
    useRouteMatch,
    useLocation,
    useHistory,
    useParams
} from "react-router-dom";

// Component
import {PrivateRoute, API} from '../../configs';
import { DetailBook, MainContent, Profile, Sidebar, Subscribe, ReadBook } from '../../components';
import {AppContext} from '../../configs';
import { LogoSidebar } from '../../assets';
// import ReadBook from "../../components/molecules/DetailBook/ReadBook"

const Home = () => {

    let paramId = useParams();

    let history = useHistory();

    let location = useLocation();

    const [state, dispatch] = useContext(AppContext);

    let { path, url } = useRouteMatch();

    const [statPay, setStatPay] = useState(null);
    const [descCancel, setDescCancel] = useState(null);

    // menyimpan url terakhir yang menyimpan id book ke variabel locPathReadBook untuk membaca buku
    const locPathReadBook = location.pathname.split("/").slice(-1)[0];
    
    // function untuk memanggil console log di compoennt react
    const ConsoleLog = (child) => {
        console.log("log dari fun",child);
        return false
    }
    
    // ==============================================================================
    // responseUserPayment
    // ==============================================================================

    const loadUser = async () => {
        try {
            const responseUserPayment = await API('/user');
            console.log("responseUserPayment", responseUserPayment);

            if (responseUserPayment.status == 200) {
                // console.log("response user home",response.data.data.user.transactions[0].remainingActive);    
                if (responseUserPayment.data.data.user.transactions.length > 0) {
                    // setStatPay("tes")
                    setStatPay(responseUserPayment.data.data.user.transactions[0].paymentStatus)
                    setDescCancel(responseUserPayment.data.data.user.transactions[0].descCancel)
                    if (responseUserPayment.data.data.user.transactions[0].remainingActive > 0) {
                        dispatch({
                            type : "PAYMENT"
                        })
                    }                    
                }            
            }
        } catch (err) {
            console.log("Your System ",err);
        }
    }
    
    useEffect(() => {
        loadUser();
    }, []);

    // ==============================================================================
    // responseBookUser
    // ==============================================================================
    
    const loadBookUser = async () => {
        try {
            const responseBookUser = await API('/bookuser');
            console.log("responseBookUser", responseBookUser.data.data.user.Books);
            
            if (responseBookUser.status == 200) {
                // console.log("response user home",response.data.data.user.transactions[0].remainingActive);    
                if (responseBookUser.data.data.user.Books.length > 0) {
                    const result = responseBookUser.data.data.user.Books;
                    dispatch({
                        type : "ADD_LIST",
                        payload : result
                    })
                }            
            }
        } catch (err) {
            console.log("Your System ",err);
        }
    }

    useEffect(() => {
        loadBookUser();
    }, []);
    
    console.log("status payment", statPay);
    console.log("status desc cancel", descCancel);
    
    return (
        <Fragment>
            {
                statPay === "Pending" ? (
                    <Alert variant="warning" className="text-center">
                        Please wait for confirmation from admin.
                    </Alert>
                ) : statPay === "Cancel" ? (
                    <Alert variant="danger" className="text-center">
                        Transaksi Gagal : {descCancel}
                    </Alert>
                ) : null
            }
            {/* <Router> */}
            {/* { ConsoleLog(location.pathname) }
            { ConsoleLog(locPathReadBook) } */}
                {/* cek apakah halaman user ini memiliki url yang valid untuk membaca buku berdasarkan id buku */}
                {
                    location.pathname === `/user/book/read/${locPathReadBook}` ? (
                        <Row className="m-5">
                            <Col md="12">
                                <Container>
                                    <img src={LogoSidebar} alt="tes" onClick={() => history.goBack()} style={{cursor:"Pointer"}} />
                                </Container>
                                <Switch>
                                    <PrivateRoute exact path={`${path}/book/read/:id`} component={SubMain} />
                                </Switch>
                            </Col>
                        </Row>
                    ) : (
                        // namun jika kondisi diatas tidak terpenuhi maka akan diarahkan ke page lain berdasarkan url
                        <Row className="m-5">
                            <Col md="3">
                                <Sidebar />
                            </Col>
                            <Col md="9">
                                <Switch>
                                    <PrivateRoute exact path={path} component={MainContent} />
                                    <PrivateRoute exact path={`${path}/:topicId`} component={Main} />
                                    <PrivateRoute exact path={`${path}/book/detail/:id`} component={SubMain} />
                                </Switch>
                            </Col>
                        </Row>

                    )

                }
                
            {/* </Router> */}
        </Fragment>
    )
}

const SubMain=()=> {
    let { id } = useParams();
    let { path, url } = useRouteMatch();
    let location = useLocation();
    console.log("location submain", location);

    // console.log('Check parameter topicId', topicId);
    console.log('Check parameter id ', id);
    console.log("Check path di home Tes", path);
    console.log("Check url di home Tes", url);

    if (location.pathname === `/user/book/detail/${id}`) {
        return(
            <DetailBook />
        );
    }
    else if (location.pathname === `/user/book/read/${id}`) {
        return(
            <ReadBook />
        );
    }
    else{
        return (
            <div>
            <h3>/{id} check halaman</h3>
            </div>
        );
    }
}


const Main =()=> {
    let { topicId } = useParams();
    let { path, url } = useRouteMatch();
    let location = useLocation();
    console.log("location Main", location);

    console.log('parameter topicId', topicId);
    console.log("path di home Tes", path);
    console.log("url di home Tes", url);

    if (location.pathname === "/user/profile") {
        return(
            <Profile />
        );
    }
    else if (location.pathname === "/user/subscribe") {
        return(
            <Subscribe />
        );
    }
    else{
        return (
            <div>
            <h3>{topicId} tes halaman</h3>
            </div>
        );
    }
}

export default Home
