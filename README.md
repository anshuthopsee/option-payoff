An Option Payoff visualizing tool, that allows you to create strategies, add and modify option legs, visualize their payoffs as it would be on the expiry date and save them to local storage. The site takes, "Buy/Sell", "Strike Price", "Premium", and "PE/CE" (Put/Call) as inputs to plot the payoff. In the future, "Days to Expiry" input, will be added to make the payoff more comprehensive and allow strategies like "Calendar Spreads" to be visualized.

## Demo
![Usage demo](demo/option-payoff.gif)

## Presets
1. Short Straddle.
2. Short Strangle.
3. Bull Call Spread.
4. Bull Put Spread.

## Features
1. Edit/Delete option legs with their respective buttons.
2. Select/Unselect option legs with the checkbox.
3. Save modified (custom) strategies as new, or update saved strategies.
4. Persistence of saved strategies through local storage.
5. Hash routing, to select a strategy from the URL without throwing a 404 error. (Example - https://anshuthopsee.github.io/option-payoff/#/Bull-Call-Spread). The strategy name is case sensitive and all the words should be joined with "-" (hyphen).
6. Numeric input value range: 0.1 >= value < 10000.

## To be added
1. Number of contracts input.
2. Zoom functionality for chart.

## Site link
## https://anshuthopsee.github.io/option-payoff/