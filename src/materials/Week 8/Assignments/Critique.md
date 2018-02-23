# Assignment 8

### Part 4
Review the interactive visualization here https://blog.csaladen.es/refugees/ (feel free to skip the intro after a couple of minutes if you get bored). Use what you have learned about data visualization design principles to come up with 5-10 notes about aspects of the visualization that you think are either good or bad (as many in each category as you feel is appropriate). In addition, come up with your own design for a visualization that displays the same data. Submit your design as a rough sketch or mock-up exported from a piece of drawing or design software. Also write a couple of sentences on why you think that your design effectively presents the data.

*Good Points:*

- I thought the filter for IDPs was a good feature since it allowed the user to only look at the flow of refugees to target countries that were not the same as the source country.


*Bad Points:*

- It wasn't apparent that the year could be toggled due to the poor positioning at the bottom of the screen.
- The colors used for the countries were all in a similar muted color family, which along with the gray background made it difficult to focus on any one country's data. With this in mind, gray probably wasn't the best color for the background since it didn't do a great job of contrasting against the countries' text and data. 
- I found the 'refugee flow threshold' toggles to be a little cumbersome to manage to exactly where I wanted the range to be. It would have been nice if the inputs were text inputs instead of toggles.
- I didn't like that the user couldn't select multiple countries at a time to omit from the visualization. There were so many countries displayed at once and it often looked very budy and unfocused. I understand that this data set is very large, complex to display, and the data is more compelling if more countries are displayed to show the intricate refugee migration relationships between countries, but some type of filtering regionally would have been appreciated when trying to analyze this data set.
- Sometimes it was difficult to see which target country the arc from source countries that had a larger volume of refugees was going to.This could have been solved if there were not as many countries displayed on the visualization at once as there were.

*My alternative chart:*

When thinking about how I actually analyzed the data, I realized I saw the relationships between the source and target countries as a network. Therefore I re-designed the visualization as a network chart where the links were vectors pointing in the direction of the flow of refugees. The nodes represented the countries and the size of the circles was proportional to the volume of internally displaced persons. I found the two separate visualizations for the target and source countries a little confusing to digest. This visualization has a country only represented once and shows the geographic networking of where refugees migrate to. I added filter options for the year and flow threshold as min and max text inputs and provided keys for the link weights and the node sizes. If the user clicked on the link between two countries, a floating text box would appear to show the exact number of refugees that migrated from the source country to the target country in the selected year. I made the background white and data colors simple to make the visualization easy on the eyes to analyze and to increase the data-to-ink ratio. 