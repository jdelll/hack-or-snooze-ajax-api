"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  getFavoritesFromLocalStorage();
  getOwnStoriesFromLocalStorage();
  putStoriesOnPage();
}


/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  //console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  if(currentUser){
    let id = story.storyId;
    let index = currentUser.favorites.findIndex((story)=>story.storyId==id);
    let myindex = currentUser.ownStories.findIndex((story)=>story.storyId==id);
    if(myindex ==-1 && index==-1){
      return $(`
        <li id="${story.storyId}">
          <span class="fa fa-star fav-button unchecked"></span>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <br>
          <small class="story-author">by ${story.author}</small>
          <br>
          <small class="story-user">posted by ${story.username}</small>
          <hr class="solid">
        </li>
      `);
    }
    if(myindex==-1 && index!=-1){
      return $(`
        <li id="${story.storyId}">
          <span class="fa fa-star fav-button checked"></span>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <br>
          <small class="story-author">by ${story.author}</small>
          <br>
          <small class="story-user">posted by ${story.username}</small>
          <hr class="solid">
        </li>
      `);
    }
    if(myindex!=-1 && index==-1){
      return $(`
        <li id="${story.storyId}">
          <span class="fa fa-star fav-button unchecked"></span>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <br>
          <small class="story-author">by ${story.author}</small>
          <br>
          <small class="story-user">posted by ${story.username}</small>
          <button class="remove-story hover">remove</button>
          <hr class="solid">
        </li>
      `);
    }
    if(myindex!=-1 && index!=-1){
      return $(`
        <li id="${story.storyId}">
          <span class="fa fa-star fav-button checked"></span>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <br>
          <small class="story-author">by ${story.author}</small>
          <br>
          <small class="story-user">posted by ${story.username}</small>
          <button class="remove-story hover">remove</button>
          <hr class="solid">
        </li>
      `);
    }
  }

  else{
    return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <br>
        <small class="story-author">by ${story.author}</small>
        <br>
        <small class="story-user">posted by ${story.username}</small>
        <hr class="solid">
      </li>
    `);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $allStoriesList.empty();
  //loop through favorites, create story, generate html
  for (let obj of currentUser.favorites) {
    let story = new Story(obj);
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $allStoriesList.empty();
  //loop through ownStories, create story, generate html
  for (let obj of currentUser.ownStories) {
    let story = new Story(obj);
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$submitForm.on("submit", async function(evt){
  console.debug("submit", evt);
  evt.preventDefault();

  const title = $("#submit-title").val();
  const author = $("#submit-author").val();
  const url = $("#submit-url").val();

  const submittedStory = await StoryList.addStory(currentUser,{
    author,
    title,
    url
  });

  $submitForm.trigger("reset");
  $submitForm.hide();
  updateUIOnUserLogin();
});

//favorites and own stories remain when page refreshes per assignment
//they do not persist when user logs in and out. future improvement.  can be done in local storage but this makes sense to be stored in a database and called by api
function saveFavoritesInLocalStorage() {
  console.debug("saveFavoritesInLocalStorage");
  if (currentUser) {
    localStorage.setItem("favorites", JSON.stringify(currentUser.favorites));
  }
}

function getFavoritesFromLocalStorage() {
  console.debug("getFavoritesFromLocalStorage");
  if (currentUser) {
    const favorites = JSON.parse(localStorage.getItem("favorites"));
    if(favorites){
      currentUser.favorites = favorites;
    }
  }
}

function saveOwnStoriesInLocalStorage() {
  console.debug("saveOwnStoriesInLocalStorage");
  if (currentUser) {
    localStorage.setItem("ownStories", JSON.stringify(currentUser.ownStories));
  }
}

function getOwnStoriesFromLocalStorage() {
  console.debug("getOwnStoriesFromLocalStorage");
  if (currentUser) {
    const ownStories = JSON.parse(localStorage.getItem("ownStories"));
    if(ownStories){
      currentUser.ownStories = ownStories;
    }
  }
}

