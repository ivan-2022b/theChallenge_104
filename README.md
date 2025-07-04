# React + TypeScript + Vite

This is a web app in response to Avantos.ai's Journey Builder Coding Challenge

To run on your local machine:

1. Downloaded and extracted the [server](https://github.com/mosaic-avantos/frontendchallengeserver)
2. Download this app
3. Open both in your preferred, seperate terminals
4. Make sure you have NodeJS/NPM installed
5. Enter commands for server: `npm start`, journey_builder: `npm run dev`
6. Finally, open the localhost link you recieve from the journey_builder terminal

Extensibility:

This application dynamically renders objects inside the "nodes" object and can accomodate any valid combination of DAG target/source relationships. In its current state, it does not check if the DAG is actually a DAG so if there is a loop, "getAncestors" function will run infintely.

Here is the link to me coding a bit of it: [YouTube] (https://youtu.be/tynk_xt0VbY)
