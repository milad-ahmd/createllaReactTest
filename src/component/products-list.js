import React, { Component } from "react";
import { Row, Col, Card, Menu, Dropdown, Icon, Button, PageHeader } from 'antd';
import './products-list.scss';
import ContentLoader from "react-content-loader"
import axios from "axios"

//array of data that you can add to this list for more filter for sorting data
const filterData = [
    { title: 'size', value: 'size' },
    { title: 'price', value: 'price' },
    { title: 'id', value: 'id' },
]

// component for pre-loader card at starter of loading page and load more data on scroll
const CardLoader = () => (
    <ContentLoader
        height={400}
        width={550}
        speed={2}
        primaryColor="#f1f1f1"
        secondaryColor="#ecebeb"
    >
        <rect x="0" y="0" rx="4" ry="4" width="545" height="65" />
        <rect x="0" y="90" rx="0" ry="0" width="545" height="30" />
        <rect x="0" y="130" rx="0" ry="0" width="545" height="30" />
        <rect x="0" y="170" rx="0" ry="0" width="545" height="30" />
    </ContentLoader>
)

class Products extends Component {

    constructor(props) {
        super(props)
        this.state = {
            productList: [],
            filter: 'price',
            page: 10,
            limit: 15,
            loading: false,
            hasMore: true
        }
    }
    //get fires page of products on mounting screen
    async componentWillMount() {
        const { page, limit, filter } = this.state
        await this.changeLoading(true)
        this.getProduct(page, limit, filter)
    }

    //add listener for changing on scroll to end and load more data if exist
    componentDidMount() {
        this.refs.iScroll.addEventListener("scroll", async () => {
            if (
                this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=
                this.refs.iScroll.scrollHeight
                &&
                this.state.hasMore
            ) {
                await this.changeLoading(true)
                this.loadItems(this.state.page + 1);
            }
        });
    }

    /*
    this function just changing loading value on state
    */
    async changeLoading(loading) {
        return await this.setState({
            loading: loading
        })
    }

    /*
    get product with page,limit,filter parameters
    */
    async getProduct(page, limit, filter) {
        axios.get(`http://localhost:3000/products?_page=${page}&_limit=${limit}&_sort=${filter}`).then(async res => {
            await this.setState({
                loading: false,
                page: this.page + 1,
                productList: this.state.productList.concat(res.data)
            })
        }).catch(err => {
            this.setState({
                loading: false,
                hasMore: false
            })
        })
    }

    /*
    calling on end scroll listener
    */
    loadItems(event) {
        const { limit, filter } = this.state
        this.getProduct(event, limit, filter)
    }

    /*
    change sort on select filter and reload data
    */
    onClickToSort = async ({ key }) => {
        await this.setState({
            filter: key,
            page: 9,
            productList: []
        });
        const { page, limit, filter } = this.state
        this.getProduct(page, limit, filter)
    };

    /*
    compare product's date with this week for showing date to user
    */
    compareDateWithToday(dateTimestamp) {
        let nowTimestamp = new Date().getTime();
        if ((nowTimestamp - (7 * 24 * 60 * 60 * 1000)) > dateTimestamp) {
            let date = new Date(dateTimestamp)
            return date.toUTCString()
        } else {
            return parseInt((nowTimestamp - dateTimestamp) / (24 * 60 * 60 * 1000)) + 1 + ' days ago'
        }
    }

    /*
    function for calculate date conditions
    */
    changeDateFormat(date) {
        let dateTimestamp = new Date(date).getTime();
        return this.compareDateWithToday(dateTimestamp);
    }

    renderRowAd() {
        let randomNumber = Math.floor(Math.random() * 1000)
        let url = 'http://localhost:3000/ads/?r='
        return (
            <div>
                <Col span={6} className="each-card">
                    <img className="ad" src={url + `${randomNumber}`} />
                </Col>
                <Col span={6} className="each-card">
                    <img className="ad" src={url + `${randomNumber + 1}`} />
                </Col>
                <Col span={6} className="each-card">
                    <img className="ad" src={url + `${randomNumber + 2}`} />
                </Col>
                <Col span={6} className="each-card">
                    <img className="ad" src={url + `${randomNumber + 3}`} />
                </Col>
            </div>
        )
    }

    render() {
        //dropdown menu of changing sort filter of products
        const menu = (
            <Menu onClick={this.onClickToSort}>
                {filterData.map((item, index) => {
                    return (
                        <Menu.Item key={item.value}>
                            <a rel="noopener noreferrer" >
                                {item.title}
                            </a>
                        </Menu.Item>
                    )
                })}
            </Menu>
        );
        return (
            <div className="wrap">
                <Row style={{ marginBottom: 15 }}>
                    <PageHeader
                        style={{
                            border: '1px solid rgb(235, 237, 240)',
                        }}
                        title="Products"
                    />
                </Row>
                <Row style={{ marginBottom: 15 }}>
                    <Col span={1}>
                        <Dropdown overlay={menu}>
                            <Button>
                                Filter by {this.state.filter} : <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </Col>
                </Row>
                <Row>
                    <div
                        ref="iScroll"
                        style={{ height: "700px", overflow: "auto" }}
                    >
                        {this.state.productList.map((item, index) => {
                            if ((index + 1) % 21 === 0) {
                                return this.renderRowAd()
                            }
                            return (
                                <Col key={index} span={6} className="each-card">
                                    <Card size="small" headStyle={{ fontSize: item.size }} title={item.face} extra={<Icon type="shopping-cart" className="add-to-cart" />} style={{ width: '100%' }}>
                                        <p className='position-relative'>
                                            <Icon type="wallet" />
                                            <span style={{ marginLeft: 10 }}>Price : </span>
                                            <span className='under-line' ><span className='icons'>$</span>
                                                {item.price}

                                            </span></p>
                                        <p className='position-relative'>
                                            <Icon type="calendar" />
                                            <span style={{ marginLeft: 10 }}>Date : </span>

                                            <span>{this.changeDateFormat(item.date)}</span></p>
                                        <div>
                                        </div>
                                    </Card>
                                </Col>

                            )


                        })}
                        {this.renderLoading(this.state.loading)}
                        {!this.state.hasMore ? <div>no more cataloges...</div> : null}

                    </div>
                </Row>
            </div>
        )
    }

    renderLoading(loading) {
        if (loading) {
            return (
                <div>
                    <div className="loader" key={0}>Loading ...</div>
                    <Col span={6} className="each-card">
                        <CardLoader />
                    </Col>
                    <Col span={6} className="each-card">
                        <CardLoader />
                    </Col>
                    <Col span={6} className="each-card">
                        <CardLoader />
                    </Col>
                    <Col span={6} className="each-card">
                        <CardLoader />
                    </Col>
                </div>
            )
        }
    }
}


export default Products
