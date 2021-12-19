import React, { Component } from 'react';
import HelloWorld from '../abis/HelloWorld';
import { Container, Form } from 'react-bootstrap';

class App extends Component {
    constructor(props) {
        super(props);
        this.state ={
            account: null,
            contract: null,
            loading: true,
        };
        this.setGreeting = this.setGreeting.bind(this);
        this.getGreeting = this.getGreeting.bind(this);
    }

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadAccount();
        await this.loadContract();
    }

    async loadWeb3() {
        const Web3 = require('web3');
        if (ethereum) {
            window.web3 = new Web3(ethereum);
        } else if (web3) {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            alert('Non-Ethereum browser detected. Consider trying MetaMask.');
        }
    }

    async loadAccount() {
        // Note: Throws unhandled error if user denies account access.
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        this.setState({ account: accounts[0] });
    }

    async loadContract() {
        const networkId = await web3.eth.net.getId();
        const networkData = HelloWorld.networks[networkId];
        if (networkData) {
            const newContract = new web3.eth.Contract(HelloWorld.abi, networkData.address);
            this.setState({ contract: newContract });
        } else {
            alert('Contract not deployed.');
        }
        this.getGreeting();
        this.setState({ loading: false });
    }

    async getGreeting() {
        const greeting = await this.state.contract.methods.greeting().call();
        this.setState({ greeting });
    }

    setGreeting(content) {
        this.setState({ loading: true });
        this.state.contract.methods.setGreeting(content)
            .send({ from: this.state.account })
            .once('receipt', (receipt) => {
                this.setState({ greeting: content });
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <Container>
               <Form onSubmit={(event) => {
                    event.preventDefault();
                    this.setGreeting(this.greeting.value);
                    console.log(this.state.greeting);
                }}>
                    <Form.Group>
                        <Form.Control ref={(input) => this.greeting = input} type="text" placeholder="Greeting" />
                    </Form.Group>
                </Form>
                { this.state.loading
                    ? <div>Loading...</div>
                    : <div>{this.state.greeting}</div>
                }
            </Container>
        );
    }
}

export default App;
