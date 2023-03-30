/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Hard-coded tweets array

// import { format } from 'timeago.js';

const tweets = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

//Document Ready shorthand
$(() => {
  //Store tweet-container section in variable
  const $tweetContainer = $("#tweet-container");
  //Create tweet using tweet template
  const createTweet = (tweet) => {
    const $tweet = $(`
    <article class="tweet">
        <header class="tweet-header">
          <div class="tweet-header-fullname">
            <img src="${tweet.user.avatars}">
            <p>${tweet.user.name}</p>
          </div>
          <div class="tweet-header-username">
            <p>${tweet.user.handle}</p>
          </div>
        </header>
        <article class="tweet-text">
          <p>${tweet.content.text}</p>
        </article>
        <footer class="tweet-footer">
          <div class="tweet-footer-days">
            <p>${timeago.format(tweet.created_at)}</p>
          </div>
          <div class="tweet-footer-icons">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
      `);

    return $tweet;
  };

  //Loop through all tweets and append them to tweet container
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweet(tweet);
      $tweetContainer.prepend($tweet);
    }
  };

  // Render the tweets on initial load
  // renderTweets(tweets);

  // Load tweets from server
  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: '/tweets'
    }).then((tweets) => {
      console.log(tweets);
      //Remove all children from #tweet-container
      $tweetContainer.empty();
      renderTweets(tweets);
    });
  };

  //Load tweets on initial load
  loadTweets();

  //Grab the form from the DOM
  const $form = $('#new-tweet-form');

  $form.on('submit', (event) => {
    // Stop the browser from refreshing the page
    event.preventDefault();

    console.log('the form has submitted');
    // Gives us back urlencoded data
    const urlencoded = $form.serialize();
    console.log(urlencoded);

    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: urlencoded
    }).then((newTweet) => {
      console.log(newTweet);

      // Load the tweets again
      loadTweets();
    });
  });

});


