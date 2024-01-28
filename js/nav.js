"use strict";

let storiesShown="all";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  storiesShown = "all";
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

//show submit form when 'submit' clicked
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.show();
  storiesShown = "all";
}

$navSubmit.on("click",navSubmitClick);


//show favorites when 'favorites' clicked
function navFavStories(evt){
  console.debug("navFavStories",evt);
  hidePageComponents();
  putFavStoriesOnPage();
  storiesShown = "fav";
}

$navFavorites.on("click",navFavStories);

//show own stories when 'my stories' clicked
function navMyStories(evt){
  console.debug("navMyStories",evt);
  hidePageComponents();
  putMyStoriesOnPage();
  storiesShown = "own";
}

$navMyStories.on("click",navMyStories)

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorites.show();
  $navDivideOne.show();
  $navDivideTwo.show();
  $navDivideThree.show();
  $navMyStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  getAndShowStoriesOnStart();
}


//known (async?) issue here.  when favorite button clicked and on 'my stories' tab, button does not change to "checked"
$allStoriesList.on("click",".fav-button",async function(evt){
  console.debug("favButton", evt);
  let storyId = evt.target.parentElement.id;
  currentUser.addFavorite(storyId);
  refresh();
})

$allStoriesList.on("click",".remove-story",function(evt){
  console.debug("removeButton",evt);
  let storyId = evt.target.parentElement.id;
  StoryList.removeStory(currentUser,storyId);
  refresh();
})

//check which tab is currently shown and update
function refresh(){

  if(storiesShown=="all"){
    getAndShowStoriesOnStart();
  }
  if(storiesShown=="fav"){
    putFavStoriesOnPage();
  }
  if(storiesShown=="own"){
    putMyStoriesOnPage();
  }
}