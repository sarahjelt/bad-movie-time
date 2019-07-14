import React, { Component } from "react";
import Modal from "./components/Modal";
import Search from './components/Search';
import axios from "axios";
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
// import { } from './actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
        poster: "",
        user_shelf: []
      },
      movies: [],
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      userid: 0,
    };
  }
  componentWillMount() {
    if (this.state.logged_in) {
      fetch('/badmovietime/current_user', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ userid: json.id })
          // console.log(`will mount ${this.state.userid}`);
        })
    }
  }
  componentDidMount() {
    if (this.state.logged_in) {
      fetch('/badmovietime/current_user', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          // console.log(json.username, json.id);
          this.setState({ username: json.username, userid: json.id });
          this.refreshList();
          // console.log(`did mount ${this.state.userid}`);
        });
    } else {
      this.refreshList();
      // console.log(this.state.userid);
    }
  }

  handleLogin = (e, data) => {
    e.preventDefault();
    fetch('/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          userid: json.user.id,
        });
      });
  }

  handleSignup = (e, data) => {
    e.preventDefault();
    fetch('/badmovietime/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username,
          userid: json.id,
        });
      });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '', userid: 0 });
  };

  displayForm = form => {
    this.setState({
      displayed_form: form
    });
  };

  refreshList = () => {
    console.log('problem?', this.state.username, this.state.userid, this.state.logged_in)
    axios
      .get("/api/movies/", {headers: { Authorization: `Token ${localStorage.getItem('token')}`}})
      .then(res => this.setState({ movies: res.data }))
      .catch(err => console.log(err));
  };
  renderItems = (seen) => {
    let newItems;

    if (seen) {
      newItems = this.state.movies.filter(
      item => item.completed === true && item.user_shelf.includes(this.state.userid)
    )} else {
      newItems = this.state.movies.filter(
      item => item.completed === false && item.user_shelf.includes(this.state.userid)
    )}

    return newItems.slice().reverse().map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <div className="movie-title">
          <span
            className={`movie-title mr-2 ${
              this.state.viewCompleted ? "completed-movie" : ""
            }`}
            title={item.description}
          >
            {item.title}
          </span>
        </div>
        <div className="movie-image">
          <img src={item.poster} width="100" alt={item.title + " poster"} />
        </div>
        <div className="buttonz">
          <span>
            <button onClick={() => this.editItem(item)} >
              {" "}
              Edit{" "}
            </button>
            <button className="delete-btn" onClick={() => this.handleDelete(item)} >
              Delete{" "}
            </button>
          </span>
        </div>
      </li>
      )
    )
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = item => {
    // console.log('problem? 3', this.state.username, this.state.userid, this.state.logged_in)
    this.toggle();
    if (item.id) {
      axios
        .put(`/api/movies/${item.id}/`, item, {headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }})
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("/api/movies/", item, {headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }})
      .then(res => this.refreshList());
  };
  handleSearchSubmit = item => {
    // console.log('problem? 4', item)
    axios
      .post("/api/movies/", item, {headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }})
      .then(res => this.refreshList());
      console.log(this.state.userid);
  };
  handleDelete = item => {
    axios
      .delete(`/api/movies/${item.id}`, {headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }})
      .then(res => this.refreshList());
  };
  createItem = () => {
    // console.log('problem? 5', this.state.username, this.state.userid, this.state.logged_in)
    fetch('/badmovietime/current_user', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          const item = { title: "", description: "", completed: false, user_shelf: this.state.userid };
          //console.log(json.username, json.id);
          this.setState({ activeItem: item, modal: !this.state.modal })
        });
  };
  editItem = item => {
    // console.log('problem? 6', this.state.username, this.state.userid, this.state.logged_in)
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  onSearch = movieTitle => {
    // console.log('problem? 7', this.state.username, this.state.userid, this.state.logged_in)
    const { movies } = this.state;
    const nextMovieState = movies.map(movie => {
      if (movie.title !== movieTitle) return movie;
      return {
        ...movie,
      };
    });
    this.setState(prevState => ({ movies: nextMovieState }));
  };
  render() {
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handleLogin} />;
        break;
      case 'signup':
        form = <SignUpForm handle_signup={this.handleSignup} />;
        break;
      default:
        form = null;
    }
    return (
      <main className="content">
      <div className="everything-but-footer">
        <Nav
          logged_in={this.state.logged_in}
          displayed_form={this.displayForm}
          handle_logout={this.handleLogout}
        />
        { form }
        <h3>
          {this.state.logged_in
            ? `Hello, ${this.state.username}!`
            : `Please log in`
          }
        </h3>
        { this.state.logged_in ? (
        <div className="flex-card-row">
          <div className="flex-card seen">
            <div className="card p-3">
              <h2>Seen</h2>
              <ul className="list-group list-group-flush">
                {this.renderItems(true)}
              </ul>
            </div>
          </div>
          <div className="flex-card search">
            <div className="card p-3">
              {/*<div className="">
                <button onClick={this.createItem}>
                  Add Movie
                </button>
              </div>*/}
              <div className="search-comp">
                <Search
                  results={this.results}
                  onSearch={this.onSearch}
                  onSave={this.handleSearchSubmit}
                  ID={this.state.userid}
                  UN={this.state.username}
                />
              </div>
            </div>
          </div>
          <div className="flex-card to-see">
            <div className="card p-3">
              <h2>To See</h2>
              <ul className="list-group list-group-flush">
                {this.renderItems(false)}
              </ul>
            </div>
          </div>
        </div>
        ) : null}
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
        </div>
        <footer>
          <h6>Powered by <a href="https://themoviedb.org" target="_blank" rel="noopener noreferrer">
          The Movie Database</a></h6>
        </footer>
      </main>
    );
  }
}
export default App;