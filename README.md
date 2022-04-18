# Moneyhub Tech Test - Investments and Holdings

At Moneyhub we use microservices to partition and separate the concerns of the codebase. In this exercise we have given you an example `admin` service and some accompanying services to work with. In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature has been received

## My Changes

- Added a processExport route for all users & individual investment ID's

- Added a getCompanies function which is called by both new routes to ensure up to date company info

- processExport will return a text/csv response in the format |User|First Name|Last Name|Date|Holding|Value|

- Holding column has the id mapped against company names returned by getCompanies

- Value column has the value calculated by multiplying the investmentTotal with the investmentPercentage

## My Changes

To process a csv you can send a request to `localhost:8083/processExport` or `localhost:8083/processExport/*any ID*`

1. How might you make this service more secure?

- I would implement a strong authentication and authorization solution to protect the endpoints and to ensure only the correct people can access them. The endpoints ould be configured to only accept incoming requests from certain IP ranges meaning not only would you need admin access but you would have to make the request from a MoneyHub server / device on the network.

- Although I would add authentication and authorization checks I would also consider storing object, user and holding ID's as UUID's rather than sequentially. At least if an unauthorized user had gained temporary access to the endpoint then they would still need to bruteforce a random 32bit ID rather than starting at 1 and counting up which will always return a users details.

2. How would you make this solution scale to millions of records?

- If an admin was to export all holdings in the system the server would have to run all of the holding values at one time which in the case of millions of users could take a lot of compute time. I would store the holdings value directly in the holdings array rather than the investment percentage. This could be achieved by running a script every night / early morning to caculate the value as markets would be closed and NAV's are usually recalculated at that time for most funds. For other markets where pre market prices are available / markets that never close (crypto etc) then current values will be slightly behind. In that case a live dashboard with external API's could easily show real time holding values.

- To avoid extra API calls I would store the holding company name in the holdings array rather than the need to map the id to get the company name, this would save a considerable amount of time when running reports for millions of users.

3. What else would you have liked to improve given more time?

- Given more time I would have liked to refactor the current solution to avoid dry code. Also to implement unit tests on the routes along with using typescript to ensure data being returned for values etc are in the correct state to perform arithmetic.

- A basic front end dashboard that an admin could type a user id in etc and the holdings could be displayed in a table. This could be used to plot holding values over time with charts etc.

## Requirements

- An admin is able to generate a csv formatted report showing the values of all user holdings
  - The report should be sent to the `/export` route of the investments service
  - The investments service expects the report to be sent as csv text
  - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
  - The holding should be the name of the holding account given by the financial-companies service
  - The holding value can be calculated by `investmentTotal * investmentPercentage`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages)
- Make effective use of git

We prefer:

- Functional code
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes

All of you work should take place inside the `admin` microservice

For the purposes of this task we would assume there are sufficient security middleware, permissions access and PII safe protocols, you do not need to add additional security measures as part of this exercise.

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around _1-2 hours_ working on it

## Deliverables

**Please make sure to update the readme with**:

- Your new routes
- How to run any additional scripts or tests you may have added
- Relating to the task please add answers to the following questions;
  1. How might you make this service more secure?
  2. How would you make this solution scale to millions of records?
  3. What else would you have liked to improve given more time?

On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.

## Getting Started

Please clone this service and push it to your own github (or other) public repository

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

Use Postman or any API tool of you choice to trigger your endpoints (this is how we will test your new route).

### Existing routes

We have provided a series of routes

Investments - localhost:8081

- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082

- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083

- `/investments/:id` get an investment record by id
