# Moonboard Guidebook 🌝

An interactive guidebook for the Moonboard, making it easier to discover and research benchmarks. Improving upon the official Moonboard app in ways you didn't even know you needed. [Wondering what all this is about?](#faq)

Note: This website is unofficial and unaffiliated with Moon Climbing.

## Features

- Mobile friendly (add it to your home screen!)
- Sandbag score, measuring how hard or soft a climb is for its grade
- Advanced filtering and sorting system, with new options such as excluded holds
- More accurate information, such as star averages calculated to three decimal places
- Connect and filter based on your logbook
- YouTube integration to provide more options for beta videos
- View and move between climb previews
- Support for all Moonboard years and angles

## Tech Stack

### Frontend
- **React** (actual website logic)
- **Bootstrap** (making it look pretty)

### Backend
- **Node** (running the server)
- **Express** (API for database access)
- **Python** (building/updating the database)

### Database
- **Postgres** (the source of all the data)

### Deployment
- **Heroku** (hosting everything)

## FAQ

### What's a Moonboard Guidebook?

The [Moonboard](https://moonboard.com) is a standarized light-up rock climbing wall with an accompanying app. You can use the app to create and light up climbs, and since it's standarized, anyone around the world with a Moonboard can try them. A small portion of published climbs are classified as benchmarks, meaning they're confirmed to be high quality and accurate for their grade. These count towards your ranking on the leaderboard and are usually the most popular. There are a few different Moonboard setups with different holds, but they all work the same way. A guidebook in climbing serves as a point of reference for a group of climbs, in this case Moonboard benchmarks.

### Why build a Moonboard Guidebook?

The Moonboard comes with an official app. I've used the Moonboard a lot and and I've used the app a lot and while I love the Moonboard, I can't say the same for the app. It's missing a number of features I wish it had, and it's slow and unintuitive to use. So this project is meant to fill those gaps! It doesn't do everything the app can, such as using Bluetooth to light up climbs or adding climbs to your logbook, but it aims to give power users a lot more tools to sort through and find cool benchmarks to try.
