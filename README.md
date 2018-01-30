# Camper

## Front End Development
* [Tribute Page](#tribute-page)
* [Personal Portfolio Webpage](#personal-portfolio-webpage)
* [Random Quote Machine](#random-quote-machine)
* [Local Weather App](#local-weather-app)
* [Wikipedia Viewer](#wikipedia-viewer)
* [Twitchtv JSON API](#twitchtv-json-api)
* [JavaScript Calculator](#javascript-calculator)
* [Pomodoro Clock](#pomodoro-clock)
* [Tic Tac Toe Game](#tic-tac-toe-game)	
* [Simon Game](#simon-game)

## Back End Development
* [Timestamp Microservice](#timestamp-microservice)
* [Request Header Parser Microservice](#request-header-parser-microservice)
* [URL Shortener Microservice](#url-shortener-microservice)
* [Image Search Abstraction Layer](#image-search-abstraction-layer)
* [File Metadata Microservice](#file-metadata-microservice)

## Details

## Front End Development

### [Certificate](https://www.freecodecamp.com/fr0st1n/front-end-certification)

### Tribute Page
##### [Link](https://codepen.io/FR0ST1N/full/RgaVZq/)
##### User Stories
* I can view a tribute page with an image and text.
* I can click on a link that will take me to an external website with further information on the topic.

### Personal Portfolio Webpage
##### [Link](https://codepen.io/FR0ST1N/full/zzqLwL/)
##### User Stories
* I can access all of the portfolio webpage's content just by scrolling.
* I can click different buttons that will take me to the portfolio creator's different social media pages.
* I can see thumbnail images of different projects the portfolio creator has built (if you haven't built any websites before, use placeholders.)
*  I navigate to different sections of the webpage by clicking buttons in the navigation.

### Random Quote Machine
##### [Link](https://codepen.io/FR0ST1N/full/dROBrg/)
##### User Stories
* I can click a button to show me a new random quote.
* I can press a button to tweet out a quote.

### Local Weather App
##### [Link](https://codepen.io/FR0ST1N/full/rwjmeP/)
##### User Stories
* I can see the weather in my current location.
* I can see a different icon or background image (e.g. snowy mountain, hot desert) depending on the weather.
* I can push a button to toggle between Fahrenheit and Celsius. 

### Wikipedia Viewer
##### [Link](https://codepen.io/FR0ST1N/full/owBJLa/)
##### User Stories
* I can search Wikipedia entries in a search box and see the resulting Wikipedia entries.
* I can click a button to see a random Wikipedia entry.

### Twitchtv JSON API
##### [Link](https://codepen.io/FR0ST1N/full/QgdobY/)
##### User Stories
* I can see whether Free Code Camp is currently streaming on Twitch.tv.
* I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.
* if a Twitch user is currently streaming, I can see additional details about what they are streaming.
* I will see a placeholder notification if a streamer has closed their Twitch account (or the account never existed). You can verify this works by adding brunofin and comster404 to your array of Twitch streamers.

### JavaScript Calculator
##### [Link](https://codepen.io/FR0ST1N/full/XggEoW/)
##### User Stories
* I can add, subtract, multiply and divide two numbers.
* I can clear the input field with a clear button.
* I can keep chaining mathematical operations together until I hit the equal button, and the calculator will tell me the correct output.

### Pomodoro Clock
##### [Link](https://codepen.io/FR0ST1N/full/dRRQgp/)
##### User Stories
* I can start a 25 minute pomodoro, and the timer will go off once 25 minutes has elapsed.
* I can reset the clock for my next pomodoro.
* I can customize the length of each pomodoro.

### Tic Tac Toe Game
##### [Link](https://codepen.io/FR0ST1N/full/mwMRRE/)
##### User Stories
* I can play a game of Tic Tac Toe with the computer.
* My game will reset as soon as it's over so I can play again.
* I can choose whether I want to play as X or O.

### Simon Game
##### [Link](https://codepen.io/FR0ST1N/full/EXvrWw/)
##### User Stories
* I am presented with a random series of button presses.
* Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
* I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
* If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
* I can see how many steps are in the current series of button presses.
* If I want to restart, I can hit a button to do so, and the game will return to a single step.
* I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
* I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.

## Back End Development

### Timestamp Microservice
##### [Source](https://github.com/FR0ST1N/Camper/tree/master/Back%20End%20Development/Timestamp%20Microservice) | [Live](https://timestamp-njs.glitch.me/)
##### User Stories
* I can pass a string as a parameter, and it will check to see whether that string contains either a unix timestamp or a natural language date (example: January 1, 2016).
* If it does, it returns both the Unix timestamp and the natural language form of that date.
* If it does not contain a date or Unix timestamp, it returns null for those properties.

### Request Header Parser Microservice
##### [Source](https://github.com/FR0ST1N/Camper/tree/master/Back%20End%20Development/Request%20Header%20Parser%20Microservice) | [Live](https://header-parser-njs.glitch.me/)
##### User Stories
* I can get the IP address, language and operating system for my browser.

### URL Shortener Microservice
##### [Source](https://github.com/FR0ST1N/Camper/tree/master/Back%20End%20Development/URL%20Shortener%20Microservice) | [Live](https://url-shortener-njs.glitch.me/)
##### User Stories
* I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
* If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
* When I visit that shortened URL, it will redirect me to my original link.

### Image Search Abstraction Layer
##### [Source](https://github.com/FR0ST1N/Camper/tree/master/Back%20End%20Development/Image%20Search%20Abstraction%20Layer) | [Live](https://image-search-njs.glitch.me/)
##### User Stories
* I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
* I can paginate through the responses by adding a ?offset=2 parameter to the URL.
* I can get a list of the most recently submitted search strings.

### File Metadata Microservice
##### [Source](https://github.com/FR0ST1N/Camper/tree/master/Back%20End%20Development/File%20Metadata%20Microservice) | [Live](https://file-metadata-njs.glitch.me/)
##### User Stories
* I can submit a FormData object that includes a file upload.
* When I submit something, I will receive the file size in bytes within the JSON response
