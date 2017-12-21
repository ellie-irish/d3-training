# D3 Training Course: Assignment 2

In this folder, you will find three data visualizations. Review each one and use what you have learned about data visualization design principles to come up with 5-10 notes about aspects of the visualization that you think are either good or bad (as many in each category as you feel is appropriate). In addition, come up with your own design for a visualization that displays the same data. Submit your design as a rough sketch or mock-up exported from a piece of drawing or design software. Also write a couple of sentences on why you think that your design effectively presents the data.


### Viz 1 - Dashboard
*Good Points:*

- The titles above each chart and the filter boxes are helpful for introducing and contextualizing the data.

- I liked the use of the color coding in the "Quarterly Performance to Goal" to signify whether or not the goal was met. Yet, this method wasn't very objective since it was assumed that the viewer would understand that red meant the quarterly goal wasn't met and green meant it was met. 

*Bad Points:*

- Although the dashboard is well organized by "major metrics," "product," and "region" variables, there is no chart available to analyze variables concurrently. The viewer can't compare two wine types together or see how different regions' sales fared in comparison.

- The "Sales Pipeline Information" table is not suited for a dashboard, but would be appropriate for a quarterly report since this table is comparing wine sales across region and by store quarterly.

- The "Quarterly Performance to Goal" charts' filter boxes seem a little ambiguous when there are already a set of filter boxes with the same inputs for the "Monthly Performance" charts. This dashboard has the potential to be simplified if there was consolidation of the filter options and data series. 

- There is no dashboard title present, which makes it difficult to initially understand what the purpose of the data is.

*My alternate design:*

I decided to not include the quarterly report and sales pipeline information in my alternate dashboard since those pieces of data would be more appropriate in a quarterly report or sales summary. The monthly performance charts were emphasized in my design with filters that allow the user to select more than one product or region when viewing the data. Therefore, comparisons across products and regions can be made within one display. I also added float boxes to display the data point information for ease of access. In order to incorporate the revenue distribution by product and region data into the dashboard, there is a time frame toggle that allows the user to select the time period he/she is interested in from the monthly performance chart. The ability to modify the x-axis time frame was included to make the dashboard more interactive and condense the large data set into a digestible display. A dashboard title was also added to emphasize the focus of the dashboard and contextualize the data better.

### Viz 2 - Dashboard
*Good Points:*

- The uniform positioning of the charts makes it visually easy to go from one to the next.

*Bad Points:*

- The bottom two pie charts are 3D, which isn't necessary since the third dimension doesn't add any new information to the chart. It also makes it difficult to judge the sizes of the pie slices since the charts are pitched. A 2D bar chart would be more appropriate to display this data.

- Since both pie charts are presenting the same data (margin is proportional to sales), one of the pie charts can be removed. 

- Legend data labels are needed for the pie charts to contextualize the data. It was unclear whether the charts were comparing specific electronics products or not.

- The axis labels and legends on the line charts need to be modified. The y-axis labels should be changed to have the correct order of magnitude, so that there are not extraneous place holders with zeroes. The x-axis labels and legends need to be more descriptive, instead of Column 1... and Row 1..., to clue the audience as to what the focus of the charts is. All of the charts presented are explanatory so they should be fairly focused and direct with the data, yet they are not given the lack of complete axis labels and legends.

- The "Sales vs. Cost of Sales" chart has both an area, bar chart, and line chart all overlaid, which makes the data confusing to interpret.

- The "Sales vs. Percent Margin" chart has a double axis but gives no indication as to which data series belong with which axis.

- Since the pie charts are describing data from 2001, which is a stationary point in time, a dashboard is not the most appropriate method for displaying this data.

- A few of the colors on the line charts are similar and difficult to differentiate, especially on the "Sales vs. Cost of Sales" chart. Also, the colors don't vary from chart to chart, which is confusing given that each chart is telling a different story concerning the products' sales data. 

*My alternate design:*

Before the focal point of the dashboard were the product types on the left, which shouldn't be the case given the data in the charts should be where the audience gravitates towards. To rectify this the product type is a drop down menu at the top. Once the product type is selected the specific products within that category are listed. It is from there the viewer can choose the product he/she wants to display. The original dashboard was too fragmented with three of the charts sharing the same x- and y-axes. To consolidate the sales, cost of sales, and moving average for sales variables, the three data series were overlaid with one another with one chosen specific product displayed at a time. In the original dashboard, the charts were very busy with sales data and the variable data overlaid with one another for all products. Now the sales data and the variable data are overlaid as only line series and the user can alter what products and product sales variables are displayed. Given this, the user interface is more dynamic and focused on the pertinent data. The year and time frame within that year can be selected to modify the data below the dotted line. The pie charts in the original dashboard were consolidated to the bottom left bar chart that changes with the time frame selection. The percent margin charts were consolidated to the bottom right bar chart that changes with the selected year. 

### Viz 3 - Chart
*Good Points:*

- The legend on the top is very organized and easy to read. 

- The blurb on top describing the focus of the data, which is to map visitor return frequency, was very good for defining the purpose of the chart. 

*Bad Points:*

- What is the "platform average"? It was difficult to bring any significance to the second bars if the data isn't properly introduced with context. I guessed it was the previous average of visitor return frequencies before the 2012 season. 

- The data-to-ink ratio is low, which makes it hard to focus on the data trends. It would be better if some of the field elements and background were muted.

- It would be nice if the user could choose the team with some type of selection functionality, like a drop down menu or search bar.  

*My alternate design:*

I found the original chart quite busy with the same colors used for both the offseason and regular season data series and the numerous data labels used. Instead of a stacked bar chart, I elected to use a clustered bar chart with each time period broken out across the x-axis. Axis labels were added to orient the user to the context of the data. In my design, the user can select the team he/she is most interested in with a drop down menu. The user can also select which part of the year and season the data displays. In the mock-up only the 2012 season is selected, but the platform averages could also be selected and would be displayed as bars of a shade lighter in color adjacent to the corresponding offseason and regular season bars. Overall the chart looks cleaner and simpler than the original, especially since the seven shades of blue and black used for the data series were omitted in the alternate design. 