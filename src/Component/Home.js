import React, { useState, } from 'react'
import { Graph } from 'react-d3-graph'
import Expense from '../classes/expense'
import { splitter } from '../utils/splitter'

const Home = () => {
  const [name, setName] = useState('')
  const [allNames, setAllNames] = useState([])
  const [flag, setFlag] = useState(false)
  const [finalValues, setFinalValues] = useState({
    "person1": "",
    "person2": "",
    "amount": ""
  })
  const [items, setItems] = useState([])
  const [outputList, setOutputList] = useState([])

  const { person1, person2, amount } = finalValues;

  const [inputGraphData, setInputGraphData] = useState({})
  const [inputGraphConfig, setInputGraphConfig] = useState({})

  const [outputGraphData, setOutputGraphData] = useState({})

  const handleFinalChange = name => event => {
    setFinalValues({ ...finalValues, [name]: event.target.value })
  }


  const handleChange = (event) => {
    setName(event.target.value)
  }

  const addParticipant = (event) => {
    event.preventDefault();
    setAllNames((previous) => [{ name }, ...previous])
    setName('')
  }

  const listOfNames = () => {
    return (
      <div className="allnames" id='nameList'>
        <h3>Names</h3>

        {allNames.map((item, index) => (
          <h4 key={index}> {item.name}</h4>
        ))
        }
      </div>
    )
  }

  const handleOpenForm = () => {
    setFlag(!false)
  }

  const myForm = () => {
    function addValues() {
      if ((finalValues['person1'] !== "") && (finalValues['person2'] !== "") && (finalValues['amount'] !== "")) {
        setItems([...items, finalValues])
      } else {
        alert("Enter all Fields")
      }
      setFinalValues({
        ...finalValues,
        "person1": "",
        "person2": "",
        "amount": ""
      })
    }
    return (
      <div className='table' >
        <table id='table1'>
          <tr>
            <th>Payer</th>
            <th>Payee</th>
            <th>Amount</th>
            <th>Add</th>
          </tr>
          {items.length > 0 && items.map((row) => (
            <tr key={row.name}>
              <td>
                {row.person1}
              </td>
              <td>{row.person2}</td>
              <td>{row.amount}</td>
            </tr>
          ))}
          <tr>
            <td>
              <form>
                <select required value={person1} onChange={handleFinalChange("person1")}>
                  {allNames.map(item => (
                    <>
                      <option value="" disabled selected hidden>Payer</option>
                      <option value={item.name}>{item.name}</option>
                    </>
                  ))
                  }
                </select>
              </form>
            </td>
            <td>
              <form>
                <select value={person2} onChange={handleFinalChange("person2")}>
                  <option value="" disabled selected hidden>Payee</option>
                  {allNames.map(item =>
                  ((person1 !== item.name) ? <option value={item.name}>{item.name}</option> : <></>
                  ))
                  }
                </select>
              </form>
            </td>
            <td align="center">
              <form>
                <input
                  type="number"
                  value={amount}
                  placeholder="Amount"
                  onChange={handleFinalChange("amount")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </td>

            <td >
              <button
                className="btn-add"
                onClick={(e) => { addValues() }}
              >
                + ADD
              </button>

            </td>
          </tr>
        </table>
      </div >
    )
  }

  const handleTransactionDataSubmit = () => {
    const data = {
      nodes: generateNodes(),
      links: generateLinks(),
    }
    const config = {
      freezeAllDragEvents: false,
      nodeHighlightBehavior: true,
      node: {
        color: "white",
        highlightStrokeColor: "white",
        fontSize: 18,
        svg: "https://cdn-icons-png.flaticon.com/512/743/743420.png",
        fontColor: "white",
        fontWeight: "bold",
        highlightFontSize: 18,
        size: 300,
      },
      link: {
        highlightColor: "white",
        renderLabel: true,
        labelProperty: "amount",
        fontSize: 15,
        fontColor: "white",
        markerHeight: 10,
        markerWidth: 10,
      },
      d3: {
        alphaTarget: 0.05,
        gravity: -1000,
        linkLength: 200,
        linkStrength: 1,
        disableLinkForce: false
      },
      directed: true,
      height: 500,
      width: 500,
    };

    setInputGraphData(data)
    setInputGraphConfig(config)
  }

  const generateNodes = () => allNames.map(item => ({ id: item.name }))

  const generateLinks = () => items.map(({ person1, person2, amount }) => ({ source: person1, target: person2, amount }))

  const generateOutputLinks = (items) => items.map(({ person1, person2, amount }) => ({ source: person1, target: person2, amount }))

  const splitterTransactions = () => {
    const input = []
    for (let item of items) {
      input.push(new Expense(item.person1, item.person2, parseInt(item.amount)))
    }
    const output = splitter(input)
    console.log('output: ', output)
    setOutputList(output)
    setOutputGraphData({ nodes: generateNodes(), links: generateOutputLinks(output) })
  }

  return (
    <div>
      <div className="name-component">
        <div className="p-name">
          <h2>Enter names of People in the group</h2>
          <div className="p-name-field">
            <textarea id="nameField" placeholder='Enter Name' cols="30" rows="10" value={name}
              disabled={flag}
              onChange={handleChange} />
          </div>
          <button className='btn-grad'
            onClick={addParticipant}
          >
            Add
          </button>
        </div>
        {(allNames && allNames.length) ? (
          <>
            <div className="list-div" id='listBox'>
              <div className="list-all-names" >
                {listOfNames()}
              </div>
            </div>
            <button className='btn-grad' onClick={handleOpenForm}>Submit</button>
          </>
        ) : null}

      </div>

      {(flag) ? (
        <>
          <div className='Instructions'>
            <details>
              <summary><h3 style={{ display: "inline", 'margin-left': "15px" }}>Instructions</h3> </summary>
              <div>
                <div className='InstructionSet'>
                  <p>Enter transactions in the table below :-</p>
                  <ol>
                    <li>Enter the names of the Payer in first column</li>
                    <li>Enter the names of the Payee in second column</li>
                    <li>Enter the amount paid in the third column</li>
                    <li>Click on add button to append transaction</li>
                    <li>Click on Build Graph to build a graph from the given transactions</li>
                    <li>Click on Simplify payments button when you are done with entering the payments.</li>
                  </ol>
                </div>
              </div>
            </details>
          </div>

          <div className='Field'>
            <div className="form">
              {flag && myForm()}
              {items && items.length ? (
                <div className="form-names">
                  <button className='btn-grad' onClick={handleTransactionDataSubmit}>Build Graph</button>
                  <button className='btn-grad' onClick={splitterTransactions}>Simplify Settlements</button>
                </div>
              ) : null}
            </div>

            <div className='Graph'>
              {Object.keys(inputGraphData).length && Object.keys(inputGraphConfig).length ? (
                <>
                  <p className='joker'>Generated graph from the transactions entered</p>
                  <Graph
                    id="graph-id" // id is mandatory
                    data={inputGraphData}
                    config={inputGraphConfig}
                  />
                </>
              ) : null}
            </div>
          </div>

          <div className='Field'>
            <div className='form'>
              {
                outputList && outputList.length ? (
                  <>
                    <h3> Simplified Settlement</h3>
                    <div className='table' id='table2'>
                      <table>
                        <tr>
                          <th>Payer</th>
                          <th>Payee</th>
                          <th>Amount</th>
                        </tr>
                        {outputList.length && outputList.map((row) => (
                          <tr key={row.name}>
                            <td>
                              {row.person1}
                            </td>
                            <td>{row.person2}</td>
                            <td>{row.amount}</td>
                          </tr>
                        ))}
                      </table>
                    </div>
                  </>
                ) : null
              }
            </div>
            <div className='Graph'>
              {
                Object.keys(outputGraphData).length && Object.keys(inputGraphConfig).length ? (
                  <>
                    <p className='joker'>Graph generated from the solution of algorithm</p>
                    <Graph
                      id="graph-id-output" // id is mandatory
                      data={outputGraphData}
                      config={inputGraphConfig}
                    />
                  </>
                ) : null
              }
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Home