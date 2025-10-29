## Description

The application shows a filter to find counties. The list is provided by the
course organizers
[countries](https://studies.cs.helsinki.fi/restcountries/api/all)
The app shows a list of matching counties if the number of matches is not too
large.
If the list is shown, then the user can click the 'show' button to display info
about the country, inclusing the current weather in the country's capital (or
one of the capitals, as in case, for example, of South Africa).
The weather is retrieved from [weatherapi](https://www.weatherapi.com) and the
application needs to export the assigned variable VITE_SOME_KEY with a key from
that web service and then the app can be started:
export VITE_SOME_KEY=your_api_key && npm run dev
