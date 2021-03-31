# [Mathbot](http://mathbotbase.herokuapp.com/) - B.Tech Final Year Project
>_(Contributer - [Shubham Aswal](https://github.com/QwertyAswal))_

This is out chatbot website, made to interactively help in the computer science domain.
We also provide two supplimantry tools -
1. #### [CSV Analyser](https://poka.pythonanywhere.com/plotYourFile)
  Here you upload a csv file and this tool lets you draw graphs between columns - _scatter-plot_, _pie-chart_, _bar-graph_, _histogram_ and _line-plot_.
2. #### [Equation Plotter](https://poka.pythonanywhere.com/EquationPlotter)
  Here you can enter any implicit equation of 2 variables x & y (like `tan(x*y)=log(x/y)+x`) and this tool will plot its graph in euclidean plane.

## **Working of Mathbot**
Mathbot consists of 3 layers - 
- 1st one is a scripted bot layer which provides basic chat functionality (like `tell me a joke`). This layer can also be interactively updated using our [Mathbot-Update webpage](http://mathbotbase.herokuapp.com/update).
- 2nd layer checks if user entered a maths calculation query like `calculate log2((3**10)%7)` and solves it.
- 3rd layer uses web-scraping, it proccesses the query, searches it on google and scraps the result for you. It also provides option to further search & scrap from [geeksforgeeks](https://www.geeksforgeeks.org/) and [cp-algorithms](https://cp-algorithms.com/).

Our Mathbot is waiting for you! *[Check it out](http://mathbotbase.herokuapp.com/)*.