/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Document Ready shorthand
$(() => {
  //Grab length-warning section from the DOM
  const $lengthWarning = $("#length-warning");
  //Grab tweet-container section from the DOM
  const $tweetContainer = $("#tweet-container");
  //Grab the form from the DOM
  const $form = $('#new-tweet-form');

  //Create tweet using tweet template
  const createTweet = (tweet) => {
    //Prevent XSS and safely render insecure text
    const escape = function(str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };
    const $tweet = $(`
    <article class="tweet">
        <header class="tweet-header">
          <div class="tweet-header-fullname">
            <img src="${escape(tweet.user.avatars)}">
            <p>${escape(tweet.user.name)}</p>
          </div>
          <div class="tweet-header-username">
            <p>${escape(tweet.user.handle)}</p>
          </div>
        </header>
        <article class="tweet-text">
          <p>${escape(tweet.content.text)}</p>
        </article>
        <footer class="tweet-footer">
          <div class="tweet-footer-days">
            <p>${escape(timeago.format(tweet.created_at))}</p>
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

  //Loop through all tweets and prepend them to tweet container
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweet(tweet);
      $tweetContainer.prepend($tweet);
    }
  };

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

  //Renders warning 
  const createWarning = function(warning) {
    const $warning = $(`
    <article class="warning">
      <i class="fa-solid fa-triangle-exclamation fa-2xl"></i>
      <p>${warning}</p>
      <i class="fa-solid fa-triangle-exclamation fa-2xl"></i>
    </article>
    `);
    return $warning;
  };

  $form.on('submit', (event) => {
    // Stop the browser from refreshing the page
    event.preventDefault();

    //Validate form by checking length, display warning if not valid
    const $formLength = $('textarea').val().length;
    console.log($formLength);

    if ($formLength > 140) {
      const excessWarning = 'Please shorten your tweet to less than 140 characters';
      const $warning = createWarning(excessWarning);

      $lengthWarning.html($warning);
      $lengthWarning.slideDown(1000);
      return;
    }

    if (!$formLength) {
      const emptyWarning = 'Please add some text to your tweet';
      const $warning = createWarning(emptyWarning);

      $lengthWarning.html($warning);
      $lengthWarning.slideDown(1000);
      return;
    }

    //Remove warning if visible and form input is valid
    $lengthWarning.slideUp(1000);

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


