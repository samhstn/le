[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/shouston3/le.svg?branch=master)](https://travis-ci.org/shouston3/le)
[![codecov.io](https://codecov.io/github/shouston3/le/coverage.svg?branch=master)](https://codecov.io/github/shouston3/le?branch=master)
[![Code Climate](https://codeclimate.com/github/shouston3/le/badges/gpa.svg)](https://codeclimate.com/github/shouston3/le)
[![Issue Count](https://codeclimate.com/github/shouston3/le/badges/issue_count.svg)](https://codeclimate.com/github/shouston3/le)

# Learning environment

## Why

I would like to create a language learning environment as I would like to learn German.
Its quite nice to go through some words if I have some spare minutes

I have a previous working version set up in a repo called learnenv, [this](shouston3.github.io/learnenv) is a working version only using the front-end - It was made without TDD, it has sloppy code and filestructure, but works ok.
I will be using this to learn from until this version is made

## What

The app will consist of different pages which revolve around the main learning environment page, pages are as follows:
* Homepage - Choose: langdir, category, order, wordListLength, wordStartPoint, reset saved (all cookies), play learnenv
* Admin page (only accessible to me), populate db, add word, add category (all saved to redis)
* learnenv page

What data I will be using:

    {
      langdir: [deen, ende, rand],
      category: [all, nouns, verbs, adberbs, adjectives, conj, custom, ...],
      order: [deAlphabetical, enAlphabetical, rand],
      wordListLength: [number (x5)],
      wordStartPoint: [number (x5)],
      count: [number (x5)]
    }

## Pages:

### Homepage

The homepage will have help button, faded into a top corner which will explain each of the app buttons

There will be a randomize button to randomize the words for a selected array start point and length, this will be a toggle option.

There will be 'Just go' button to just start testing random words for your selected direction

There will be an option to test the languages in random directions as well as random words

There will be an option in the form of two buttons, to choose the language direction (Consider current language direction and an onclick will switch the language direction)

There will be two sliders to adjust the array length as well as the array start point

There will be a settings option on the opposite top side of the page where the user can adjust:

Slider increments, buttons shown on le page, font size?, number of divs shown on each page, looping when finished?...

There should be an option to reset your marked words and to look at your marked words for review

(balsamic image of the makeup of the page)

### Learning environment page

The le page will have four buttons on the right:
* home (linking back to the homepage)
* show/hide (showing/hiding hidden translated divs)
* next (next divs in the array)
* prev (next divs in the array)

It will have a clicker button on the left side of the screen which will show the next unhidden div and will call next, if all the divs are showing

There will be a counter on the top left above the clicker which will display which items are showing out of the total in your chosen array length.

There will be (a default) 5 divs on the left in the correct chosen language direction, they will be clickable to show the translation divs.

There will be an option to star a word for review, and will be logged for review in the homepage

### Admin page

## How

All of the words will be stored in a database which will be retrieved by redis, the 'review' words will be stored in a redis database, these can be reviewed and edited in the homepage.

I will make each component individually using React

## File structure

config.env
node_modules
package.json
README.md
assets
coverage
back
  redis.js
  server.js
  js
    all other .js files
  backTest
    test.js
front
  index.html
  style.css
  js
    all other .js files
  frontTest/
    test.js
