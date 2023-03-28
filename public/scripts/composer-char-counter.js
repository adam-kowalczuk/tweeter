$(document).ready(function() {
  //Confirm document is ready to use jQuery
  console.log('document is ready');

  $("#tweet-text").on('input', function() {
    const maxLength = 140;
    //The number of characters currently in the textarea
    let charLength = $(this).val().length;
    //Store the 'output' (the counter) element in a variable
    let counter = $(this).parent().find("div").find("output");
    //Add/subtract character count (will display on page)
    counter.text(maxLength - charLength);
    //Make counter red if maxLength is exceeded
    if (charLength > maxLength) {
      counter.addClass('text-red');
    } else {
      counter.removeClass('text-red');
    }
  });
});