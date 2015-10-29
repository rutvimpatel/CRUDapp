// Rutvi Patel 
// INFO 343 C
// Challenge 4 
// CRUD app


"use strict";
$(function() {

	Parse.initialize('G6lqWWEtV7e0fIjgrJsGVsGtGAoRtS4Jzm7QIH0h', '8lkqHTsPY7KXJuueUYqOhxUQUjM5M91AKpDRuzSt');

	var totalReviews = 0;
	var totalScore = 0;
	var Review = Parse.Object.extend('Review');

	// This function will create a new review in the database when the user submits one
	$('form').submit(function() {
	 
		var rev = new Review();
		
		// This gets the user's input and then resets the fields to 0
		var overall = $('#opinion').val();
			$('#opinion').val('');
		var addReview = $('#addReview').val();
			$('#addReview').val('');
		var rating = parseInt($("#stars").raty('score'));
			$("#stars").raty({score : 0});

		// These will be used to keep track of how many people found the 
		// review helpful.
		rev.set('totalHelp', 0);
		rev.set('helpful', 0);
			
		rev.set('overall', overall);
		rev.set('addReview', addReview);
		rev.set('rating', rating);

		rev.save(null, {
			success:getData
		});
		return false;	
	})

	// This function will query the database. If it is successful in looking
	// for results, it will build the list of reviews to display
	var getData = function() {
		var query = new Parse.Query(Review);
		query.descending('createdAt');
		query.notEqualTo('overall', '');
		query.find({ 
			success:function(results) {
				buildList(results);
			} 
		});
	}

	// This function builds the list of exiting reviews
	var buildList = function(results) {
		// It clears the old list before making a new one
		$('#reviewList').empty();

		results.forEach(function(d) {
			addItem(d);
		});
	}

	// This functions adds items to the page to display as reviews
	var addItem = function(elem) {
		totalReviews += 1;
		// creates a new div for each review
		var item = $('<div>');
		item.attr('class', 'review');
		$('#reviewList').append(item);

		// div for the overall opinion
		var opinion = $('<h3>');
		opinion.text(elem.get('overall'));
		opinion.attr('id', 'title');
		item.append(opinion);

		// div for the actual review
		var review = $('<p>');
		review.attr('id', 'review');
		review.text(elem.get('addReview'));
		opinion.append(review);

		// this gets the rating the customer gave the item
		var score = elem.get('rating');
		totalScore += score;
		// this adds the appropriate number of stars to the display depending 
		// on the score for the item
		for (var i = 0; i < score; i++) {
			var dispStar = $('<i>');
			dispStar.attr('class', 'fa fa-star');
			item.append(dispStar);
		}

		// This section of code creates the upvote and downvote buttons
		var vote = $('<div>').attr('class', 'vote');
		item.append(vote);
		var upvote = $('<button class="fa fa-thumbs-up fa-2x"></button>');
		vote.append(upvote);
		var downvote = $('<button class="fa fa-thumbs-down fa-2x"></button>');
		vote.append(downvote);

		// This creates to button to delete the review.
		var button = $('<button class="fa fa-trash-o btn-s"></button>');
		item.append(button);
		button.attr('id', 'trash');

		// deletes the clicked item
		button.click(function() {
			elem.destroy({
				success:getData
			});
		});

		// This prints how many people found the review helpful
		var thoughts = $('<p>').attr('class', 'thoughts');
		update(item, thoughts, elem);

		// This updates how many people found the review helpful 
		upvote.click(function() {
			elem.increment("totalHelp");
			elem.increment("helpful");
			elem.save();
			update(item, thoughts, elem);

		})
		// This acts in the case that people found it unhelpful
		downvote.click(function() {
			elem.increment("totalHelp");
			elem.save();
			update(item, thoughts, elem);
		})	
		average();
	}
	// This prints how many people found the review helpful
	var update = function (item, thoughts, elem) {
		thoughts.text('');
		thoughts.text(elem.get('helpful') + " out of " + elem.get('totalHelp') + " people found this review helpful");
		item.append(thoughts);
	}

	// This calls getData to build the existing list of reviews
	getData();
	// This creates the stars so the user can rate
	$('#stars').raty();
	// This displays the average rating 
		
	// This calculates and displays the average rating for the product
	var average = function() {
		var math = Number(totalScore / totalReviews);
		$('#ave').raty({
			readOnly : true,
			halfShow: true,
			score : math 
		});
	}
})
