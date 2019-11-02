import React, { Component } from "react";
import { Row, Col, Card, Menu, Dropdown, Icon, Button, PageHeader, Input } from 'antd';
import './products-list.scss';
import ContentLoader from "react-content-loader"
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroller';

const filterData = [
    { title: 'size', value: 'size' },
    { title: 'price', value: 'price' },
    { title: 'id', value: 'id' },
]

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
            page: 9,
            limit: 15,
            loading: false
        }
    }
    async componentWillMount() {
        const { page, limit, filter } = this.state
        this.getIntialProduct(page, limit, filter)
    }

    componentDidMount() {
        this.refs.iScroll.addEventListener("scroll", async () => {
            if (
                this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=
                this.refs.iScroll.scrollHeight
            ) {
                await this.changeLoading(true)
                this.loadItems(this.state.page + 1);
            }
        });
    }

    async getIntialProduct(page, limit, filter) {
        await this.changeLoading(true)

        axios.get(`http://localhost:3000/products?_page=${page}&_limit=${limit}&_sort=${filter}`).then(async res => {
            console.log(this.state.loading);

            await this.setState({
                loading: false,
                page: this.page + 1,
                productList: this.state.productList.concat(res.data)
            })
        }).catch(err => {

        })
    }

    async changeLoading(loading) {
        return await this.setState({
            loading: loading
        })
    }
    async getProduct(page, limit, filter) {
        axios.get(`http://localhost:3000/products?_page=${page}&_limit=${limit}&_sort=${filter}`).then(async res => {
            await this.setState({
                loading: false,
                page: this.page + 1,
                productList: this.state.productList.concat(res.data)
            })
        }).catch(err => {

        })
    }
    loadItems(event) {
        const { limit, filter } = this.state
        this.getProduct(event, limit, filter)
    }
    onClick = async ({ key }) => {
        await this.setState({
            filter: key,
            page: 9,
            productList: []
        });
        const { page, limit, filter } = this.state
        this.getIntialProduct(page, limit, filter)
    };

    render() {

        const menu = (
            <Menu onClick={this.onClick}>
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

                                            <span> 2 days age</span></p>
                                        <div>
                                        </div>
                                    </Card>
                                </Col>

                            )
                        })}
                    </div>
                    {this.renderLoading(this.state.loading)}
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
