import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Table} from 'react-bootstrap'

// @ts-ignore
import {Corpus, Similarity} from "tiny-tfidf";

type SimilarityType = {
    sentence: string;
    policy: string;
    similarity: number;
}

function App() {

    const [sentences, setSentences] = useState(
        'This is test document number 1. It is quite a short document.\n' +
        'This is test document 2. It is also quite short, and is a test.\n' +
        'Test document number three is a bit different and is also a tiny bit longer.'
    )
    const [policies, setPolicies] = useState(
        'This is test document number 1. It is quite a short document.\n' +
        'This is test document 2. It is also quite short, and is a test.\n' +
        'Test document number three is a bit different and is also a tiny bit longer.'
    )
    let [results, setResults] = useState<SimilarityType[]>([]);

    const predict = () => {

        let corpus_names: string[] = [];
        let corpus_texts: string[] = [];

        let ss = sentences.split(/\r?\n/);
        ss.forEach((s, i) => {
            corpus_names.push('s' + i);
            corpus_texts.push(s);
        });

        let pp = policies.split(/\r?\n/)
        pp.forEach((s, i) => {
            corpus_names.push('p' + i);
            corpus_texts.push(s);
        });
        console.log(corpus_names);
        console.log(corpus_texts);

        const corpus = new Corpus(corpus_names, corpus_texts);

        const similarity = new Similarity(corpus);
        const distance = similarity.getDistanceMatrix();
        console.log(distance);
        let results: SimilarityType[] = []
        for (let s = 0; s < ss.length; ++s) {
            for (let p = 0; p < pp.length; ++p) {
                let d = distance.matrix[s][ss.length + p];
                results.push(
                    {
                        sentence: ss[s],
                        policy: pp[p],
                        similarity: ((1 - d) * 100)
                    }
                );
            }
        }
        setResults([...results]);
    }

    return (
        <Container className="App" fluid>
            <Row>
                <Col md={6}>
                    <label>Sentences : </label>
                    <textarea
                        rows={15}
                        style={{width:'100%'}}
                        value={sentences}
                        onChange={e => setSentences(e.target.value)}
                    />
                    <label>Policies : </label>
                    <textarea
                        rows={15}
                        style={{width:'100%'}}
                        value={policies}
                        onChange={e => setPolicies(e.target.value)}
                    />
                </Col>
                <Col>
                    <button onClick={predict}>
                        Evaluate Similarity
                    </button>
                    <Table striped bordered hover size="sm" responsive>
                        <thead>
                        <tr>
                            <td>sentence</td>
                            <td>policy</td>
                            <td>similarity %</td>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((r, i) => {
                            return (
                                <tr key={i}>
                                    <td>{r.sentence}</td>
                                    <td>{r.policy}</td>
                                    <td>{r.similarity.toFixed(2)}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {/*<header className="App-header">
            </header>*/}
        </Container>
    );
}


export default App;