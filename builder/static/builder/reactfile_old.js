import React from 'react';
import ReactDOM from 'react-dom';
import {useState, useContext, useEffect, useReducer, createContext} from "react";

import {Navbar, NavDropdown, Nav, Container} from 'react-bootstrap';

import { useRef } from 'react';

import logo from './images/blucherkopf.png';

import die1 from './images/wurf1s.png';
import die2 from './images/wurf2s.png';
import die3 from './images/wurf3s.png';
import die4 from './images/wurf4s.png';
import die5 from './images/wurf5s.png';
import die6 from './images/wurf6s.png';
import questmark from './images/wurfquestions.png';

//<img src="/static/builder/bundled/d48856276f2fdad03b21c92dd47e6add.png" alt="4444Dice with question mark"/>

const dicePics = [questmark, die1, die2, die3, die4, die5, die6];

function displayReducer(state, action) {
    switch(action.type) {
        case 'Momentum':
            return {showMomentum :true, showMyLists :false, showBuilder: false, showLogin: false, showRegister: false, transparent: true};
        case 'MyLists':
            return {showMomentum :false, showMyLists :true, showBuilder: false, showLogin: false, showRegister: false, transparent: true};
        case 'Builder':
            return {showMomentum :false, showMyLists :false, showBuilder: true, showLogin: false,showRegister: false, transparent: true};
        case 'Login':
            return {showMomentum :false, showMyLists :false, showBuilder: false, showLogin: true, showRegister: false, transparent: false};
        case 'Register':
            return {showMomentum :false, showMyLists :false, showBuilder: false, showLogin: false, showRegister: true, transparent: false};
        default:
            return {showMomentum: false, showMyLists: false, showBuilder: false, showLogin: false, showRegister: false, transparent: false};
    }
}

// share state in tree without prop drilling through children,
const AppContext = createContext();

// outsourced from App()
function ContextProvider(props) {

    const [myArmy, setMyArmy] = useState(null);
    //get login status from django backend in index.html
    const [loggedIn, setLoggedIn]= useState(backendDataLogin);
    const [username, setUsername]= useState(backendDataName);
    const [categories, setCategory] = useState({selected:"Infantry", available:["Infantry", "Cavalry", "Artillery", "Commander", "Allies", "Special"]});
    return (
        <AppContext.Provider value={{usernameContext: [username, setUsername], myArmyContext: [myArmy, setMyArmy], categoryContext: [categories, setCategory], loggedInContext: [loggedIn, setLoggedIn]}}>
            {props.children}
        </AppContext.Provider>
    )
}


function App() {
    const [displayState, setDisplayState] = useReducer(displayReducer, {showMomentum: false, showMyLists: false, showBuilder: false, showLogin: false, showRegister: false, transparent: false});
    return (
        <div id="app-main">
    {/* <div id="main" style={{backgroundImage: `url("{title}")`}}>
        <div id="main" style={{backgroundImage: "url(/static/builder/081260011bf669d43f5ee2c96dcef894.jpg)"}}>*/}
            <ContextProvider>
                <Header setDisplayState = {setDisplayState}/>
                <div id="body-div" className = {!displayState.transparent ? "bg-full" : null}>
                    { displayState.showLogin && <Login setDisplayState = {setDisplayState}/>}
                    { displayState.showRegister && <Register setDisplayState = {setDisplayState}/>}
                    { displayState.showMomentum && <Momentum displayState = {displayState}/>}
                    { displayState.showMyLists && <MyLists displayState = {displayState} setDisplayState = {setDisplayState}/>}
                    { displayState.showBuilder && <Builder displayState = {displayState}/>}
                </div>
            </ContextProvider>
        </div>
    )
}

function Header({setDisplayState}) {

    const {myArmyContext, categoryContext, loggedInContext, usernameContext} = useContext(AppContext);
    const [myArmy, setMyArmy] = myArmyContext;
    const [categories, setCategory] = categoryContext;
    const [loggedIn,] = loggedInContext;
    const [username,] = usernameContext;

    function handleSelect(eventKey) {
        // if an army was already created, copy the this old army into respective factions[myArmy.id] for later use when change back to this
        // country's list builder
        if (myArmy != null) {
            factions[myArmy.id] = myArmy;
        }
        //change Army and switch to Builder component 
        setMyArmy(factions[eventKey]);
        setCategory({...categories, selected: "Infantry"});
        setDisplayState({type: 'Builder'});
    }
    //const handleChange = event => setMyArmy(event.target.eventKey]);

    return (
        <Navbar collapseOnSelect fixed="top"className="navbar" bg="dark" expand="md" variant="dark">
            <Container className="navbar-container">
                <Navbar.Brand href="/" id="navbar-brand">
                    <img
                        alt=""
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block brand-logo" //align-top
                        />
                    <span className="navbar-text brand-text">Happy Blucher</span>
                </Navbar.Brand>
                {loggedIn && <Nav>
                    <Nav.Item>
                        <Nav.Link>
                            Welcome {username}!
                        </Nav.Link>
                    </Nav.Item>
                </Nav>}
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav
                        className="me-auto nav-links justify-content-end"
                        style={{ width: "100%" }}>

                        <Nav.Item onClick={() => setDisplayState({type: 'Momentum'})}>
                                <Nav.Link eventKey="15">
                                    Momentum
                                </Nav.Link></Nav.Item>  

                                <NavDropdown onSelect={handleSelect} title="List Builder" id="nav-dropdown">
                                {factions.map((faction) =>
                                    <NavDropdown.Item eventKey={faction.id} key={faction.id}>{faction.name}</NavDropdown.Item>)}                    
                            </NavDropdown>

                            {!loggedIn && <Nav.Item onClick={() => setDisplayState({type: 'Login'})}>
                                <Nav.Link eventKey="17">
                                    Login
                                </Nav.Link>
                            </Nav.Item>}

                            {!loggedIn && <Nav.Item onClick={() => setDisplayState({type: 'Register'})}>
                                <Nav.Link eventKey="18">
                                    Register
                                </Nav.Link>
                            </Nav.Item>}

                            {loggedIn && <Nav.Item onClick={() => setDisplayState({type: 'MyLists'})}>
                                <Nav.Link eventKey="16">
                                    My Lists
                                </Nav.Link>
                            </Nav.Item>}

                            {loggedIn && <Nav.Item>
                                <Nav.Link href="/logout" eventKey="19">
                                    Logout
                                </Nav.Link>
                        </Nav.Item>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


function Login({setDisplayState}) {
    //username has it's own context
    const [password, setPassword] = useState("");

    const {loggedInContext, usernameContext} = useContext(AppContext);
    const [, setLoggedIn] = loggedInContext;
    const [username, setUsername] = usernameContext;

    const [message, setMessage] = useState("");


    // setDisplay nicht true/false sondern direkt className "bg-transparent"

    function loginRequest() {

        fetch('/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({username: username, password: password})
        })
        .then(response => response.json())
        .then(status => {
            if (status.logged_in) {
                setLoggedIn(status.logged_in);
                //empty dict for default value in switch case of reducer
                setDisplayState({});
            }
            else {
                setMessage(status.message);
            }
        })
        .catch((e) => {
            console.error('Error:', e);
        });
    }
        return (
            <div className="login-div">
                 <div className ="error-message">
                    {message}
                </div>
                <div className="login-form">
                    <form autoComplete="off">
                        <div className="form-group">
                            <input autoFocus className="form-control login-margin" type="text" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <input className="form-control login-margin" type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => loginRequest()}>Login</button>
                    </form>
                </div>
            </div>
        )
}


function Register({setDisplayState}) {
    
    //username has it's own context
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const {loggedInContext, usernameContext} = useContext(AppContext);
    const [, setLoggedIn] = loggedInContext;
    const [username, setUsername] = usernameContext;

    const [message, setMessage] = useState("");


    function Register() {

        fetch('/register', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({username: username, password: password, confirmation: confirmation})
        })
        .then(response => response.json())
        .then(status => {
            if (status.logged_in) {
                setLoggedIn(status.logged_in);
                //empty dict for default value in switch case of reducer
                setDisplayState({});
            }
            else {
                setMessage(status.message);
            }
        })
        .catch((e) => {
            console.error('Error:', e);
        });
    }
        return (
            <div className="login-div">
                <div className ="error-message">
                    {message}
                </div>
                <div className="login-form">
                    <form autoComplete="off">
                        <div className="form-group">
                            <input autoFocus className="form-control login-margin" type="text" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <input className="form-control login-margin" type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <input className="form-control login-margin" type="password" name="confirmation" placeholder="Confirm Password" onChange={(e) => setConfirmation(e.target.value)}/>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => Register()}>Register</button>
                    </form>
                </div>
            </div>
        )
}



function MyLists(props) {

    const {myArmyContext, categoryContext} = useContext(AppContext);
    const [myArmy, setMyArmy] = myArmyContext;

    const [, setCategory] = categoryContext;
    const [activeRow, setActiveRow] = useState();

    // lists fetched from API
    const [lists, setLists] = useState(null);
    // sorting direction
    const [lowToHigh, setLowToHigh] = useState(true);

    // get lists once during first render of MyLists component
    
    useEffect(() => {
        fetchMyLists();
        }, [])

    // fetches all list of user from server (after first render of MyLists component and after deleteLis deleteAll
    function fetchMyLists() {
        fetch('/my_lists') 
        .then(response => response.json())
        .then(lists => setLists(lists))
        .catch(e => console.error('Error:', e))
        }


    function loadList(id) {
        fetch(`/load_list/${id}`)
        .then(response => response.json())
        .then(convertedResponse => {
            // convert the JSON string in .data in a JS object
            const temp = JSON.parse(convertedResponse.data);
        
            // set the Army/Column prototypes to get methods of object again
            Object.setPrototypeOf(temp, Army.prototype);
            for (let column in temp.columns) {
                Object.setPrototypeOf(temp.columns[column], Column.prototype);
            }
             // factions[temp.id] keeps factions armylist in case the faction is changed
             //factions[temp.id] = temp;
            setMyArmy(temp);
            setCategory(prevState=> ({...prevState, selected: "Infantry"}));
            props.setDisplayState({type: 'Builder'});
        })
        .catch(e => console.error('Error:', e))
    }
        
    function sortDescription() {
        if (lowToHigh) {
            const sorted = lists.sort((a, b) => {
              let name_a = a.description.toLowerCase();
              let name_b = b.description.toLowerCase();
              if (name_a < name_b) {
                return -1;
              }
              if (name_a > name_b) {
                return 1;
              }
              return 0;
            });
            setLists(sorted);
            setLowToHigh(false);
          }
        else {
            const sorted = lists.sort((a, b) => {
              let name_a = a.description.toLowerCase();
              let name_b = b.description.toLowerCase();
              if (name_b < name_a) {
                return -1;
              }
              if (name_b > name_a) {
                return 1;
              }
              return 0;
            });
            setLists(sorted);
            setLowToHigh(true);
          }
    }

    function sortFaction() {
        if (lowToHigh) {
            const sorted = lists.sort((a, b) => {
              let name_a = a.faction.toLowerCase();
              let name_b = b.faction.toLowerCase();
              if (name_a < name_b) {
                return -1;
              }
              if (name_a > name_b) {
                return 1;
              }
              return 0;
            });
            setLists(sorted);
            setLowToHigh(false);
          }
        else {
            const sorted = lists.sort((a, b) => {
              let name_a = a.faction.toLowerCase();
              let name_b = b.faction.toLowerCase();
              if (name_b < name_a) {
                return -1;
              }
              if (name_b > name_a) {
                return 1;
              }
              return 0;
            });
            setLists(sorted);
            setLowToHigh(true);
          }
    }

    function sortPoints() {
        if (lowToHigh) {
            const sorted = lists.sort((a, b) => {
              return b.points - a.points;
            });
            setLists(sorted);
            setLowToHigh(false);
          }
          else {
            const sorted = lists.sort((a, b) => {
              return a.points - b.points;
            });
            setLists(sorted);
            setLowToHigh(true);
          }
    }

    function sortDate() {
        if (lowToHigh) {
            const sorted = lists.sort((a, b) => {
              if (a.date > b.date) return 1;
              if (a.date < b.date) return -1;
              return 0;
            });
            setLists(sorted);
            setLowToHigh(false);
          } else {
            const sorted = lists.sort((a, b) => {
              if (a.date > b.date) return -1;
              if (a.date < b.date) return 1;
              return 0;
            });
            setLists(sorted);
            setLowToHigh(true);
          }
    }


    function deleteList(id) {
        // check if a list has been selected
        if (id) {
            let message = "Confirm to delete";
            if (confirm(message) == true) {
                fetch(`/delete_list/${id}`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                })
                .then(response => {
                    console.log(response);
                    fetchMyLists();
                })
                .catch((e) => {
                    console.error('Error:', e);
                });
            }
        } 
    }  


    function deleteAll() {
        let message = "Confirm to delete all ";
        if (confirm(message) == true) {
            fetch('/delete_all', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
            })
            .then(response => {
                console.log(response);
                fetchMyLists();
            })
            .catch(e => {
                console.error('Error:', e );
            });
        }
    }
 
    return (
        <div id="mylist-container">
            <div id="mylist-table" className="table-responsive">
                <table className={`table table-striped table-hover + ${props.displayState.transparent ? "bg-transparent" : null}`}>  
               {/* <table className={props.displayState.transparent ? "bg-transparent table table-striped" : "table table-striped"}>*/}
                    <thead>
                        <tr>
                            <th className="icon-both" onClick={() => sortDescription()}>Name</th>
                            <th className="icon-both" onClick={() => sortFaction()}>Armylist</th>
                            <th className="icon-both" onClick={() => sortPoints()}>Points</th>
                            <th className="icon-both" onClick={() => sortDate()}>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                        {lists && (lists.map((list, index) => (
                        <tr key={index} onClick={() => setActiveRow(list.id)} className={list.id == activeRow ? "table-active" : "" } onDoubleClick={()=> loadList(list.id)}>
                            <th>{list.description}</th>
                            <td>{list.faction}</td>
                            <td>{list.points}</td>
                            <td>{list.date}</td>
                        </tr>
                    )))}
                    </tbody>
                </table>
            </div>
            <div id="mylist-buttons">
                <button type="button" className="btn btn-success" onClick={() => loadList(activeRow)}>Load</button>
                <button type="button" className="btn btn-success" onClick={() => deleteList(activeRow)}>Delete</button>
                <button type="button" className="btn btn-success" onClick={() => deleteAll()}>Delete All</button>
            </div>
        </div>
    )
}

               
function Builder(props) {
    return (
        <div className = {props.displayState.transparent ? "bg-transparent" : null}>
            <BuilderNavBar />
            <DisplayTable />
            <div id="buttons-and-total-points" >
                <ColumnControl />
                <TotalPoints />
            </div>
            <DisplayColumns />
        </div>
    )
}

function BuilderNavBar() {

    const { myArmyContext, categoryContext, loggedInContext } = useContext(AppContext);
    const [categories, setCategory] = categoryContext;
    const [loggedIn,] = loggedInContext;
    const [myArmy, setMyArmy] = myArmyContext;

    const componentRef = useRef();

    function changeCategory(newCategory) {
        setCategory(categories => ({...categories, selected: newCategory}));
    }

    function printArmy() {
        // get the window object of the iframe with ".contentWindow"
        var myFrame = document.getElementById("my-frame").contentWindow;
        myFrame.document.open();
        myFrame.document.write(
            `<!DOCTYPE html>
            <html>
            <head>
                <link href="/static/builder/styles.css" type="text/css" rel="stylesheet">
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body id="iframe-body">
            <div id="print-content">
                <div style="display: flex; justify-content: center; margin-bottom: 2rem;">
                    <div style="margin: 0.5rem;">
                        <img
                        alt=""
                        src=${logo}
                        width="40"
                        height="40"
                        classname="d-inline-block brand-logo" //align-top
                        />
                    </div>
                    <div style="display: flex; flex-direction: column; margin: 0.5rem;">
                        <div style="font-weight:500; border-bottom: 1px solid;">Happy Blucher</div>
                        <div style="font-weight:500;">Army Builder</div>
                    </div>
                </div>
    
                <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; grid-row-gap: 4rem; border-bottom: 1px solid; margin-bottom: 2rem;">
                    <div style="text-align: left;">List Name: ${myArmy.description}</div>
                    <div style="text-align: center;">${myArmy.name}</div>
                    <div style="text-align: right;">Units/Points: ${myArmy.totalUnits}/${myArmy.totalPoints}</div>
                </div>
                <br>
                <div style = "display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">
                ${myArmy.columns.map((column, columnIndex) => {
                    return (
                        `<div>
                        <ul style="list-style-type: none;">
                            <li style="text-decoration: underline;">Column ${columnIndex +1} - ${column.totalUnits}/${column.totalPoints}</li>
                                ${column.units.map((unit, index) => {
                                    return `<li>${unit.name}</li>`
                                    }).join('')
                                }
                
                            </ul>       
                        </div>`
                    )}).join('')
                }
                </div>
            </div>
            </body>
            </html>`
        );
        myFrame.document.close();
        myFrame.focus();
        myFrame.print();
    }


    return (
        <nav id="builder-navbar" className="navbar">
            <div className= "navbar-container container">
                <div id="description-bar">
                    <Description />
                </div>
                <div id="left-builder-control">
                {/*<form className=" container-fluid justify-content-start">*/}
                    {/* check if category is available in this countries army list and render button, otherwise render disabled button  */}
                    {categories.available.map((category, index) =>
                        // array.some() checks if elements pass a test, if one element is true, some() returns true. 
                        myArmy.unitsAvailable.some(unit => unit.type == (category.toLowerCase()) || (category == "Commander" && unit.type == "subcommander")) 
                        ? <button onClick={() => changeCategory(category)} className="btn btn-sm btn-outline-success" type="button" key={index}>{category}</button>
                        /* show a disabled button if unit type not found*/
                        /*: <button onClick={() => changeCategory(category)} disabled className="btn btn-sm btn-outline-success" type="button" key={index}>{category}</button>*/
                        : null
                    )}
                </div>
                <div id="right-builder-control">
                    {loggedIn ?
                        <button onClick={() => saveList(myArmy, setMyArmy)} className="btn btn-sm btn-outline-secondary" type="button">Save</button>
                        :
                        <button disabled onClick={() => saveList(myArmy)} className="btn btn-sm btn-outline-secondary" type="button">Save</button>}

                    <button onClick = {printArmy} className="btn btn-sm btn-outline-secondary" type="button" >Print</button>
                   {/* <button onClick = {() => printArmy()} className="btn btn-sm btn-outline-success" type="button" >Print</button> */}
                    <button onClick = {() => exportArmy(myArmy)} className="btn btn-sm btn-outline-secondary" type="button" >Export</button>
                </div>
            </div>
        </nav>
    )
}


function DisplayTable() {

    const { myArmyContext, categoryContext } = useContext(AppContext);
    const [myArmy, setMyArmy] = myArmyContext;
    const [categories, setCategory] = categoryContext;


    //if count of prussian infantry [5]-[8] changes, adjust max of mixedbrigade and landwehr shock 
    useEffect(() => {
        if (myArmy.country == "prussianlate") {
            myArmy.unitsAvailable[19].max = Math.floor((myArmy.unitsAvailable[5].count +
            myArmy.unitsAvailable[6].count +
            myArmy.unitsAvailable[7].count +
            myArmy.unitsAvailable[8].count) / 3);

            myArmy.unitsAvailable[20].max = Math.floor(myArmy.unitsAvailable[8].count / 2);
            setMyArmy(prevState => ({ ...prevState, myArmy}));
        }
    }, [myArmy.unitsAvailable[5].count, myArmy.unitsAvailable[6].count, myArmy.unitsAvailable[7].count, myArmy.unitsAvailable[8].count]);

    function countSubcommander() {
        //highest number of subcommanders in an army is 8 (frenchearly)
        let count = 0;
        for (let i=0; i<8; i++) {
            if (myArmy.unitsAvailable[i].type === "subcommander") {
                count += myArmy.unitsAvailable[i].count;
            }
        }
        return count;
    }

    // add unit
    function handleAddUnit(unit, index) {
        // if no column yet
        if (myArmy.columns.length == 0) {
           
            //myArmy's Army.prototype is lost somewhere during react rerender?. therefore reassignment
            Object.setPrototypeOf(myArmy, Army.prototype);
            myArmy.addColumn();
        }
        // add unit to active column
        myArmy.columns[myArmy.activeIndex].addUnit(unit, index, myArmy);
        setMyArmy(myArmy => ({...myArmy}));
        //setMyArmy((prevState) => ({...prevState, columns:myArmy.columns}));
    }

    // remove unit from selected column or the highest indexed column with unit count in table clicked
    function handleRemoveUnit(unit) {
        //check if unit exists in active column
        for (let i=0; i<myArmy.columns[myArmy.activeIndex].units.length; i++) {
            if (myArmy.columns[myArmy.activeIndex].units[i].id == unit.id) {
                myArmy.columns[myArmy.activeIndex].removeUnit(myArmy, unit);
                setMyArmy({...myArmy, unitsAvailable:myArmy.unitsAvailable, columns:myArmy.columns});
                return;
            }
        }
        //loop over myArmy.columns array from highest to lowest column
        for (let i=myArmy.columns.length-1; i>=0; i--) {
            //loop over the units in respective column
            for (let k=0; k<myArmy.columns[i].units.length; k++) {
                if (myArmy.columns[i].units[k].id == unit.id) {
                    myArmy.columns[i].removeUnit(myArmy, unit);
                    setMyArmy({...myArmy, unitsAvailable:myArmy.unitsAvailable, columns:myArmy.columns});
                    return;
                }
            }
        }
    }
      
    function checkExceedance(unit) {
        if (unit.min) {
            if (unit.count < unit.min) {
                return "exceedance"
            }
        }
        if (unit.type === "subcommander") {
            if (countSubcommander() > myArmy.maxSubcommander) {
                return "exceedance";
            }
        }
        if (unit.max || unit.max===0) {
            // if landwehr shock or mixedbrigade number is more than max
            if (unit.id == 197) {
                if (myArmy.unitsAvailable[19].max < unit.count) {
                    return "exceedance"
                }
                else {
                    return;
                }
            }
            if (unit.id == 198) {
                if (myArmy.unitsAvailable[20].max < unit.count) {
                    return "exceedance"
                }
                else {
                    return;
                }
            }
            if (unit.count > unit.max) {
                return "exceedance"
            }
        }
    }

    return (
        <div id="builder-table">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{myArmy.name}</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Points</th>
                        <th>Specials</th>
                    </tr>
                </thead>
                <tbody>
                    {myArmy.unitsAvailable.map(function(unit,index) {
                        return (
                            unit.type.includes(categories.selected.toLowerCase()) ? (
                                <tr key={unit.id}>
                                    <td onClick = {() => handleRemoveUnit(unit)} className={checkExceedance(unit)}>{unit.count}</td>
                                    <td onClick = {() => handleAddUnit(unit, index)}>{unit.name}</td>
                                    <td onClick = {() => handleAddUnit(unit, index)} className={checkExceedance(unit)}>{unit.min ? unit.min : "-"}</td>
                                    <td onClick = {() => handleAddUnit(unit, index)} className={checkExceedance(unit)}>{unit.max ? unit.max : "-"}</td>
                                    <td onClick = {() => handleAddUnit(unit, index)}>{unit.points}</td>
                                    <td onClick = {() => handleAddUnit(unit, index)}>{unit.special}</td>
                                </tr>
                                )
                            : null
                        )
                    })}
                </tbody>
            </table>
        </div>
      );
}


// button components
function ColumnControl() {
    const {myArmyContext} = useContext(AppContext);
    const [myArmy, setMyArmy] = myArmyContext;

    function add(){
        Object.setPrototypeOf(myArmy, Army.prototype);
        myArmy.addColumn();
        setMyArmy({...myArmy, columns:myArmy.columns});
        {/*setMyArmy((prevState) => ({...prevState, myArmy}));*/}
    }
    
    function remove() {
        Object.setPrototypeOf(myArmy, Army.prototype);
        myArmy.removeColumn();
        setMyArmy({...myArmy, columns:myArmy.columns});
    }
    
    function clear() {
        Object.setPrototypeOf(myArmy.columns[myArmy.activeIndex], Column.prototype);
        if (myArmy.columns[myArmy.activeIndex]) {
            myArmy.columns[myArmy.activeIndex].clearColumn(myArmy);
            setMyArmy({...myArmy, columns:myArmy.columns});
        }
    }
    return (
        <div id= "column-control">
                <button type="button" className="btn btn-sm btn-success" onClick={add}>Add Column</button>
                <button type="button" className="btn btn-sm btn-success" onClick={remove}>Remove Column</button>
                <button type="button" className="btn btn-sm btn-success" onClick={clear}>Clear Column</button>
        </div>
    );
}

function TotalPoints() {
    const {myArmyContext} = useContext(AppContext);
    const [myArmy,] = myArmyContext;

    return (
        <div id="total-points">
                Total units: {myArmy.totalUnits} / Total points: {myArmy.totalPoints}
        </div>
    )
}

function Description() {
    const {myArmyContext} = useContext(AppContext);
    const [myArmy, setMyArmy] = myArmyContext;

    function handleChange(value) {
        setMyArmy(prevState => ({ ...prevState, description: value}));
    }

    return (
    <div>
        <input autoFocus type="text" name="description" value={myArmy.description ? myArmy.description : ""} placeholder="Untitled List" maxLength="30" onChange={(e) => handleChange(e.target.value)}/>
    </div>
    )
}


function DisplayColumns() {
    const {myArmyContext} = useContext(AppContext);
    const [myArmy, setMyArmy] = myArmyContext;

    // use for custom className in return map-function
    let troopTypeClass ="";

    function changeActiveIndex(columnIndex) {
        console.log("this is also triggered");
        /*setMyArmy((prevState) => ({...prevState, myArmy}));*/
        setMyArmy(prevState => ({ ...prevState, activeIndex: columnIndex}));
    }

    function handleRemoveUnit(columnIndex, unit) {
        if (myArmy.activeIndex != columnIndex) {
            changeActiveIndex(columnIndex);
        }
        else {
            //remove unit from active column and 
            myArmy.columns[myArmy.activeIndex].removeUnit(myArmy, unit);
            setMyArmy(prevState => ({ ...prevState, myArmy}));
        }
    }

    function setActiveColumnClass(columnIndex){
        if (columnIndex == myArmy.activeIndex) {
            return "activeColumn"
        }
        else {
            return ""
        }
    }

    // remove column with click on "x"
    function remove() {  
        Object.setPrototypeOf(myArmy, Army.prototype);
        myArmy.removeColumn();
        setMyArmy(myArmy => ({...myArmy, columns:myArmy.columns}));
    }

    function handleRemove(event, clickedIndex) {
        //remember activeIndex
        const oldIndex = myArmy.activeIndex;
        // change activeIndex to remove respective column (required in the data.js removecolumn function)
        myArmy.activeIndex = clickedIndex;
        remove();
        //to prevent bubbling and execution of onclick of parent div (changeActiveIndex)
        event.stopPropagation();
        if (oldIndex < clickedIndex) {
            setMyArmy(myArmy => ({...myArmy, activeIndex:oldIndex}));
        }
        else if (oldIndex > clickedIndex) {
            setMyArmy(myArmy => ({...myArmy, activeIndex:oldIndex-1}));
        }
        else if (oldIndex == clickedIndex && clickedIndex == myArmy.columns.length) {        
            setMyArmy(myArmy => ({...myArmy, activeIndex:oldIndex-1}));
        }
        else if (oldIndex == clickedIndex) {
            setMyArmy(myArmy => ({...myArmy, activeIndex:oldIndex}));
        }
    }
    
    const content = myArmy.columns.map((column, columnIndex) => { 
        return (
            <div className="column-div" key={columnIndex}>
                <ul className="list-group">
                    {/*<li className={`list-group-item list-group-item-action column-header ${setActiveColumnClass(columnIndex)}`} onClick={(e) => changeActiveIndex(columnIndex)}>Column {columnIndex +1} - {column.totalUnits}/{column.totalPoints}
                        <span className="close-div">&#x2715;</span>
                    </li>*/}
                    <li className={`list-group-item list-group-item-action column-header ${setActiveColumnClass(columnIndex)}`} onClick={(e) => changeActiveIndex(columnIndex)}>
                        <div className="centered">Column {columnIndex +1} - {column.totalUnits}/{column.totalPoints}</div>
                        <div className="cancel-x" onClick={(e) => handleRemove(e, columnIndex)}>&#x2715;</div>
                    </li>
                    {column.units.map((unit, index) => {
                        switch(unit.type) {
                            case "infantry":
                                troopTypeClass = "list-group-item-success"
                                break;
                            case "cavalry":
                                troopTypeClass = "list-group-item-warning"
                                break;
                            case "artillery":
                                troopTypeClass = "list-group-item-danger"
                                break;
                            case "commander":
                            case "subcommander":
                                troopTypeClass = "list-group-item-primary"
                                break;
                            case "allies":
                                troopTypeClass = "list-group-item-light"
                                break;
                            case "special":
                                troopTypeClass = "list-group-item-info"
                                break;
                            default:
                                null;
                        }
                        return <li className={`list-group-item list-group-item-action small-font ${troopTypeClass}`} onClick = {() => {
                            handleRemoveUnit(columnIndex, unit);
                         }} key={index}>{unit.name}</li>
                    })}
                </ul>
            </div>
        )
    })
    return (
        <div id="column-display">
            {content}
        </div>
    );    
}


function saveList(myArmy, setMyArmy) {
    /*
    let description = "";
    // keep asking until input
    while (description == "") {
        description = prompt('Enter Listname');
    }
    // check if input dialogue was canceled
    if (description) {
        fetch('/save_list', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                description: description,
                savedList: myArmy,
            })
        })
            .then(response => {
            console.log(response);
            })
            .catch((e) => {
            console.error('Error:', e);
            });
    }  
    */
  
        fetch('/save_list', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                savedList: myArmy,
            })
        })
        .then(response => {
            console.log(response.json);
        })
        .catch((e) => {
        console.error('Error:', e);
        });
}


function Momentum(props) {

    const [diceCount, setDiceCount] = useReducer(diceReducer, 3);
    const [usedMomentum, setUsedMomentum] = useState(0);
    const [rolledDice, setRolledDice] = useState([]);
    const [rolledSum, setRolledSum] = useState(0)
    const [stopWarning, setStopWarning] = useState(false);
    const [proceedWarning, setProceedWarning] = useState(false);
    const [wasRolled, setWasRolled] = useState(false);

    function handleDice(temp, sum) {
        setRolledDice(temp);
        setRolledSum(sum);
    }

    function reset() {
        setStopWarning(false);
        setProceedWarning(false);
        setUsedMomentum(0);
    }

    function diceReducer(state, action) {
        switch(action.type) {
            case 'add':
                if (state < 12) {
                    return state +1;
                }
                else {
                    return state;
                }
            case 'remove':
                if (state > 1) {
                    return state -1;
                }
                else {
                    return state;
                }
            default:
                return state;
        }
    }

    function rollDice() {
        reset();
        setWasRolled(true);
        let helperArray = [];
        let helperSum = 0;
        for (let i=0; i<diceCount; i++) {
            let die = Math.floor(Math.random() * 6) + 1;
            helperArray.push(die);
            helperSum = helperSum + die;
        }
        //set the state in helper function as setState is asynchronous 
        handleDice(helperArray, helperSum);
    }

    function checkMomentum() {
            if (usedMomentum >= rolledSum) {
                setProceedWarning(false);
                setStopWarning(true);
            }
            else {
                setProceedWarning(true);
            }
    }

    function MomentumControl(){
        function addMomentum() {
            setUsedMomentum(usedMomentum +1);
            setProceedWarning(false);
        }
    
        function removeMomentum() {
            if (usedMomentum > 0) {
                setUsedMomentum(usedMomentum -1);
                setProceedWarning(false);
            }
        }
        return (
            <div id="momentum-control">
                <div>
                    <span>Used Momentum: </span>
                </div>
                <div>
                    <button className="btn btn-secondary btn-lg" onClick = {removeMomentum}>-</button>
                    <span>{usedMomentum}</span>
                    <button className="btn btn-secondary btn-lg" onClick = {addMomentum}>+</button>
                </div>
                {!stopWarning && rolledDice.length > 0 && usedMomentum > 0 && <CheckButton />}
            </div>
        )
    }

    function DiceControl(){
        
        function addDice() {
            setDiceCount({type:'add'});
            reset();
            if (wasRolled == true) {
                setWasRolled(false);
            }
        }
    
        function removeDice() {
            setDiceCount({type:'remove'});
            reset();
            if (wasRolled == true) {
                setWasRolled(false);
            }
        }
        return (
            <div id="dice-control">
                    <div>
                        <span>Momentum Dice: </span>
                    </div>
                    <div>
                        <button className="btn btn-secondary btn-lg" onClick={removeDice}>-</button>
                        <span>{diceCount}</span>
                        <button className="btn btn-secondary btn-lg" onClick={addDice}>+</button>
                        <button className="btn btn-secondary btn-lg" onClick={rollDice}>Roll</button>
                    </div>
                </div>
        )
    }

    function Warning() {
        return  (
            <div id="stop-container">
                <div id="stop-warning">Stop</div>
                <div>Score: {rolledSum}</div>
            </div>
        )
    }

    function ShowDice() {
        if (rolledDice.length > 0) {
            if (stopWarning) {
                return (
                    <div className="show-dice">
                        {rolledDice.map((die, index) => {
                            return (
                                <div className="dice-img" key={index}>
                                    <img src={dicePics[die]} alt={die}/>
                                </div>
                            )
                        })}
                    </div>  
            )}
            else {
                return (
                    <div className="show-dice">
                        {[...Array(diceCount)].map((elementInArray, index) => ( 
                            <div className="dice-img" key={index}>
                                <img src={dicePics[0]} alt="Dice with question mark"/>
                            </div> 
                        ))}
                    </div>
                )
            }      
        } 
        else return null;
    }

    function Proceed() {
        return <div id="proceed-warning">Proceed</div>
    }

    function CheckButton() {
        return (
        <div id="check-button">
            <button className="btn btn-secondary btn-lg" onClick = {checkMomentum}>Check</button>
        </div>
        )}

    return (
            <div id="dice" className = {props.displayState.transparent ? "bg-transparent" : null}>
                <DiceControl />
                <ShowDice />
                {rolledDice.length > 0 && wasRolled && <MomentumControl />}
                {stopWarning && <Warning/>}
                {proceedWarning && <Proceed/>}
            </div>
    )
}


function exportArmy(myArmy) {

    // create and fill content variable 
    const content = myArmy.columns.map((column, columnIndex) => {
        return (
            `<div>
                <ul>
                    <li>Column ${columnIndex +1} - ${column.totalUnits}/${column.totalPoints}</li>
                    ${column.units.map((unit, index) => {
                        return `<li>${unit.name}</li>`
                    }).join('')
                    }
                    <br>
                </ul>       
            </div>`
        )
    // map return array with commas. join('') removes them 
    }).join('');
    var exportWindow = window.open();
    //exportWindow.document.body.innerHTML = "<p>hello world</p> <h1>this is a test</h1>";
    //exportWindow.document.body.innerHTML = "<html><head><title>This is the title</title></head><body>help_text</body></html>";

    exportWindow.document.open();
    exportWindow.document.write(
        `<!DOCTYPE html>
        <html>  
            <head>
                <link href="/static/builder/styles.css" type="text/css" rel="stylesheet">        
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <div>List Name: ${myArmy.description}</div><div>Army List: ${myArmy.name}</div>
                <div>Units/Points: ${myArmy.totalUnits}/${myArmy.totalPoints}</div><br><div>${content}</div>
            </body>
        </html>
    `);
    exportWindow.document.close();        
}

/*

function exportArmy(myArmy) {

    // create and fill content variable 
    const content = myArmy.columns.map((column, columnIndex) => {
        return (
            `<div className="column-div">
                <ul className="list-group">
                    <li className="list-group-item list-group-item-action">Column ${columnIndex +1} - ${column.totalUnits}/${column.totalPoints}</li>
                    ${column.units.map((unit, index) => {
                        return `<li className="list-group-item list-group-item-action">${unit.name}</li>`
                    }).join('')
                    }
                    <br>
                </ul>       
            </div>`
        )
    // map return array with commas. join('') removes them 
    }).join('');
    var exportWindow = window.open();
    //exportWindow.document.body.innerHTML = "<p>hello world</p> <h1>this is a test</h1>";
    //exportWindow.document.body.innerHTML = "<html><head><title>This is the title</title></head><body>help_text</body></html>";

    exportWindow.document.open();
    exportWindow.document.write(
        `<!DOCTYPE html>
        <html>  
            <head>
                <title>Happy Blucher Builder</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"/>
                <!--<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">-->
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>

                <link href="/static/builder/styles.css" type="text/css" rel="stylesheet">


                <!--  not required because react already installed with npm, import ReactDOM from 'react-dom';
                <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>-->
                <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>

                <script src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js" crossorigin></script>
        
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <div className="redpaint">Listname: ${myArmy.description}</div><div>Armylist: ${myArmy.name}</div>
                <div>Units/Points: ${myArmy.totalUnits}/${myArmy.totalPoints}</div><br><div>${content}</div>
            </body>
        </html>
    `);
    exportWindow.document.close();        
}

*/

ReactDOM.render(<App />, document.querySelector("#root"));


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
