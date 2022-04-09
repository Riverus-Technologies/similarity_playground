import React, {useState} from 'react';
import './App.css';
// @ts-ignore
import {Corpus, Similarity} from "tiny-tfidf";

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
    let [results, setResults] = useState('Results will generated here')

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
        results = '';
        for (let s=0; s < ss.length; ++s) {
            for (let p=0; p < pp.length; ++p) {
                let d = distance.matrix[s][ss.length + p];
                console.log("Similarity:");
                console.log("---> s" + s, ":", ss[s]);
                console.log("---> p" + p, ":", pp[p]);
                console.log("---> distance :", (1 - d) * 100, "%");
                results += "Similarity:\n";
                results += ("---> s" + s + " : " + ss[s]);
                results += ("---> p" + p + " : " + pp[p]);
                results += ("---> distance : " + (1 - d) * 100 + "%");
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <label>Sentences : </label>
                <textarea
                    rows={10}
                    cols={200}
                    value={sentences}
                    onChange={e => setSentences(e.target.value)}
                />
                <label>Policies : </label>
                <textarea
                    rows={10}
                    cols={200}
                    value={policies}
                    onChange={e => setPolicies(e.target.value)}
                />
                <label>Similarity : </label>
                <span>{results}</span>
                <button onClick={predict}>
                    Evaluate
                </button>
            </header>
        </div>
    );
}


export default App;