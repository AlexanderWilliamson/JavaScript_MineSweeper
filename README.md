Website Minesweeper, written in HTML, CSS, and JavaScript.
Allows users to customize grid size, and mine probabilities.
Provides automation levels that users can use to remove manually clicking obvious squares.

There are 3 seperate automation levels:
Level 0: No automation is done, this is the default
Level 1: Squares that have a nearby value of 1 and have only 1 adjacent square that has not been revealed has that adjacent square automatically flagged.
Level 2: Squares that have a nearby value equal to the number of adjacent squares that have not been revealed has all adjacent squares that have not been revealed automatically flagged.
   
Mine probability is a range from 0-1 inclusive. Where 1 is 100% chance of a mine being on a square and 0 being 0%.
Grid width and height is limited to at least 1 and can go at most 250. Therefore the max amount of squares per game is 250^2 = 62500 squares. This limit is inplace due to memory limitations.
