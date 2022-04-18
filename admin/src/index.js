const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const axios = require('axios');
const {
  Parser,
  transforms: { unwind, flatten },
} = require('json2csv');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.get('/investments/:id', (req, res) => {
  const { id } = req.params;
  request.get(
    `${config.investmentsServiceUrl}/investments/${id}`,
    (e, investments) => {
      if (e) {
        console.error(e);
        res.sendStatus(500);
      } else {
        res.sendStatus(investments);
      }
    }
  );
});

const getCompanies = async () => {
  let companies;
  await axios
    .get(`${config.financialcompaniesUrl}/companies`)
    .then((e) => {
      companies = e;
    })
    .catch((e) => {
      return e;
    });
  return companies.data;
};

app.get('/processExport/:id', async (req, res) => {
  let companies = await getCompanies();
  let investments;
  const { id } = req.params;

  await axios
    .get(`${config.investmentsServiceUrl}/investments/${id}`)
    .then(function (r) {
      investments = r.data[0];
      investments.holdings.map((i) => {
        companies.map((c) => {
          if (c.id === i.id) {
            i.id = c.name;
          }
        });
        i.investmentValue =
          investments.investmentTotal * i.investmentPercentage;
      });
      const fields = [
        {
          label: 'User',
          value: 'userId',
        },
        {
          label: 'First Name',
          value: 'firstName',
        },
        { label: 'Last Name', value: 'lastName' },
        { label: 'Date', value: 'date' },
        { label: 'Holdings', value: 'holdings.id' },
        { label: 'Value', value: 'holdings.investmentValue' },
      ];
      const json2csvParser = new Parser({
        fields,
        transforms: [
          unwind({
            paths: ['holdings'],
            blankOut: true,
          }),
        ],
      });
      const csv = json2csvParser.parse(investments);
      res.setHeader('Content-disposition', 'attachment; filename=test.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send(error);
    });
});

app.get('/processExport', async (req, res) => {
  let companies = await getCompanies();
  let investments;
  await axios
    .get(`${config.investmentsServiceUrl}/investments`)
    .then(function (r) {
      investments = r.data;
      investments.map((x) => {
        x.holdings.map((i) => {
          companies.map((c) => {
            if (c.id === i.id) {
              i.id = c.name;
            }
          });
          i.investmentValue = x.investmentTotal * i.investmentPercentage;
        });
      });
      const fields = [
        {
          label: 'User',
          value: 'userId',
        },
        {
          label: 'First Name',
          value: 'firstName',
        },
        { label: 'Last Name', value: 'lastName' },
        { label: 'Date', value: 'date' },
        { label: 'Holdings', value: 'holdings.id' },
        { label: 'Value', value: 'holdings.investmentValue' },
      ];
      const json2csvParser = new Parser({
        fields,
        transforms: [
          unwind({
            paths: ['holdings'],
            blankOut: true,
          }),
        ],
      });
      const csv = json2csvParser.parse(investments);
      res.setHeader('Content-disposition', 'attachment; filename=test.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send(error);
    });
});

app.listen(config.port, (err) => {
  if (err) {
    console.error('Error occurred starting the server', err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});

module.exports = getCompanies;
