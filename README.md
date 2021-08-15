# AI Battle 2048 Game(Developing)
Area competition with AI in the 2048 game

## Game Rules
This game is a modified of 2048 game.

The player and the AI take turns taking one action among up, down, left, and right. 

There are two types of blocks in the game: **player's blocks** and **AI's blocks**.

If you combine two identical blocks, you get the block of the next level.

During your turn, you can combine your opponent's blocks with the same number of blocks. The merged block becomes yours.

Conversely, the AI may take your block.
### `Score`
Each `score` is calculated as the sum of the scores of your blocks.

At this point, the `score` for the block increases exponentially.

The `score` for block 1 is 1. The `score` for block 2 is 2. The `score` for block 3 is 4. Block 4 has a `score` of 8.

This means that block i has a `score` of 2^(i-1).

### Win and lose conditions
If your opponent's `score` is 10 times higher than your `score`, you lose.

If there is no action to change the state, the state called **Stuck state**.
In **Stuct state**, the player with the highest `score` wins. If the `score` is the same, the person who made `Stuck state` is win.

# Quick Setup

    npm install react-scripts
    npm install react-router-dom
    npm install firebase/app
    npm install react-google-login
    npm install react-native
    npm install react-native-swiper --save
    npm run build
    node server

## Screenshots

![initial](https://user-images.githubusercontent.com/17401630/128634089-9ed78bed-4464-4c7c-a51c-3d03684d50be.png)