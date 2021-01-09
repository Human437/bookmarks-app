import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';

class EditBookmark extends Component {
  constructor(props){
    super(props)
    this.state={
      id: '',
      title:'',
      url:'',
      description: '',
      rating: 1,
    }
  }
  static contextType = BookmarksContext;

  componentDidMount() {
    const { id } = this.props.match.params
    fetch(config.API_ENDPOINT + `/${id}`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(response =>{
      return response.json()
    })
    .then(data => {
      this.setState({
        id: data.id,
        title: data.title,
        url: data.url,
        description: data.description,
        rating: data.rating,
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(config.API_ENDPOINT + `/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      },
    })
    .then(res => {
      if (!res.ok)
        return res.json().then(error => Promise.reject(error))
    })
    .then(() => {
      this.context.updateBookmark(newBookmark)
      this.props.history.push('/')
    })
  }
  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  };
  render(){
    const { title, url, description, rating } = this.state
    return(
      <>
        <form id = 'editBookmarkForm' onSubmit = {this.handleSubmit}>
          <label htmlFor='title'>Title</label>
          <input 
            type='text' 
            name='title' 
            id='title' 
            placeholder ='placeholder title'
            required
            onChange = {this.handleChangeTitle}
            value = {title}
          />
          <br/>
          <label htmlFor='URL'>URL</label>
          <input
            type='url'
            name='url'
            id='url'
            placeholder='https://www.great-website.com/'
            required
            onChange={this.handleChangeUrl}
            value = {url}
          />
          <br/>
          <label htmlFor='description'>Description</label>
          <textarea
            name='description'
            id='description'
            onChange={this.handleChangeDescription}
            value = {description}
          />
          <br/>
          <label htmlFor ='rating'>Rating</label>
          <input
            type='number'
            name='rating'
            id='rating'
            min='1'
            max='5'
            required
            onChange={this.handleChangeRating}
            value = {rating}
          />
          <br/>
          <br/>
          <button type='submit'>Save</button>
        </form>
      </>
    )
  }
}

export default EditBookmark;