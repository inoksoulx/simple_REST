const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Bear = require('./app/models/bear');

const app = express();
mongoose.connect('mongodb://inok:test@ds161640.mlab.com:61640/bearsdb');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.port || 8000;

const router = express.Router();

router.use((req, res, next) => {
  console.log('Something is happen');
  next();
})

router.get('/', (req, res) => {
  res.json({ message: 'Hello'});
})

router.route('/bears/:name')
  .post((req, res) => {

    var bear = new Bear();
    bear.name = req.params.name;

    bear.save((err) => {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Bear created' });
    })
  })

router.route('/bears')
  .get((req, res) => {
    Bear.find((err, bears) => {
      if (err) {
        res.send(err);
      }

      res.json(bears);
    })
  })

router.route('/bears/:bear_id')
  .get((req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {
      if (err)
        res.send(err);

      res.json(bear);
      });
    })
  .put((req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {
      if (err)
        res.send(err)
      bear.name = req.body.name;

      bear.save((err) => {
        if(err)
          res.send(err)

        res.json({message: 'Bear UPD'})
      })
    })
  })
  .delete((req, res) => {
    Bear.remove({
      _id: req.params.bear_id
    }, (err, bear) => {
      if(err)
        res.send(err)
      res.json({ message: 'Successfully deleted'})
    })
  })


app.use('/api', router);
app.listen(port, () => {
  console.log('Server live on ' + port)
})
