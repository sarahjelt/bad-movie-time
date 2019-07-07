import React, { Component } from 'react';
import API from '../utils/API';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      results: this.props.results,
      ID: this.props.ID,
      UN: this.props.UN
    };
  }

  handleChange = e => {
    this.setState({ searchValue: e.target.value });
  };

  formActionDeterminer = event => {
    event.preventDefault();

    API.searchByQuery(this.state.searchValue)
      .then(res => {
          this.parseResultsFromAPICall(res)
      });
  }

  clearForm = event => {
    event.preventDefault();
    this.setState({searchValue: "", results: null})
  }

  parseResultsFromAPICall = (res) => {
    let results = res.results;
    // console.log(results);
    let savedResults = [];

    results.forEach(mediaItem => {
      let mediaItemObj = {
          id: mediaItem.id,
          title: mediaItem.name !== undefined ? mediaItem.name : mediaItem.title,
          description: mediaItem.overview,
          poster: mediaItem.poster_path ? ("https://image.tmdb.org/t/p/w500" + mediaItem.poster_path) : "/img-placeholder.png",
          completed: false,
          user_shelf: [this.props.ID]
        }

        savedResults.push(mediaItemObj);
      })

    this.setState({
      results: savedResults
    })
  }

  render() {
    const { onSave } = this.props;
    return (
      <div className="inner-search-comp">
        <form>
          <input
              placeholder='Search...'
              id='Search'
              type='text'
              value={this.state.searchValue}
              onChange={(event) => this.handleChange(event)}
          />
          <button
            type="submit"
            onClick={this.formActionDeterminer}>
            Search
          </button>
          <button
            className="clear-search"
            onClick={this.clearForm}
          >
            Clear Search
          </button>
        </form>
        {this.state.results ? (
          this.state.results.map(result => (
            <div key={result.id}>
              <h4>{result.title}</h4>
              <p>{result.description}</p>
              <div className="search-res-poster">
                <img src={result.poster} width="100" alt={result.title + " poster"} />
                <button onClick={() => onSave(result)}>
                  Save
                </button>
              </div>
            </div>
          ))
        ) : null }
      </div>
    );
  }

}