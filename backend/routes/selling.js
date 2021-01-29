const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'tmp/csv/' });

const fs = require('fs');
const csv = require('fast-csv');

let listingsCSV = [];
let contactsCSV = [];

const readCSV = async (filePath, originalName) => {
  const csvRows = [];
  fs.createReadStream(filePath)
    .pipe(csv.parse())
    .on('error', (error) => console.error(error))
    .on('data', (row) => csvRows.push(row))
    .on('end', () => {
      console.log(originalName);
      if (originalName.includes('contacts')) {
        contactsCSV = [...csvRows];
      } else {
        listingsCSV = [...csvRows];
      }
      fs.unlinkSync(filePath);
    });
};

router.post('/upload', upload.single('file'), function (req, res) {
  const fileRows = [];
  readCSV(req.file.path, req.file.originalname);
  // console.log(req.file);
  // console.log(contactsCSV.length, listingsCSV.length);
  res.send('file uploaded successfully');
});

router.get('/listing/average/sellertype', (req, res) => {
  const sellerType = {
    private: { total: 0, count: 0 },
    dealer: { total: 0, count: 0 },
    other: { total: 0, count: 0 },
  };
  listingsCSV.forEach((record, index) => {
    //sellertype column
    if (index !== 0) {
      sellerType[record[4]].total += +record[2];
      sellerType[record[4]].count++;
    }
  });
  const averageSellings = {
    private: sellerType['private'].total / sellerType['private'].count,
    dealer: sellerType['dealer'].total / sellerType['dealer'].count,
    other: sellerType['other'].total / sellerType['other'].count,
  };
  res.send({ message: 'The Average listing', averageSellings });
});

router.get('/listing/percentual', (req, res) => {
  const percentual = {};
  listingsCSV.forEach((record, index) => {
    //sellertype column
    if (index !== 0) {
      console.log(listingsCSV.length);
      if (record[1] in percentual) {
        percentual[record[1]] += (1 / (listingsCSV.length - 1)) * 100;
      } else {
        percentual[record[1]] = (1 / (listingsCSV.length - 1)) * 100;
      }
    }
  });

  res.send({ message: 'The Average listing', percentual });
});
router.get('/contact/top/month', (req, res) => {
  const filterByDate = {};
  contactsCSV.forEach((record, index) => {
    //sellertype column
    if (index !== 0) {
      const date = new Date(+record[1]);
      const fullDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (fullDate in filterByDate) {
        filterByDate[fullDate].push(record[0]); //put listing_id only
      } else {
        filterByDate[fullDate] = [record[0]]; ////put listing_id only
      }
    }
  });

  const topFivePerMonth = [];
  //group by date
  Object.keys(filterByDate).map((date) => {
    const idsCounter = {};

    const idArray = filterByDate[date];
    // counting the occuerencess
    idArray.forEach((id) => {
      if (id in idsCounter) {
        idsCounter[id]++;
      } else {
        idsCounter[id] = 1;
      }
    });
    const keys = Object.keys(idsCounter);
    // sort in descending order to get top 5
    keys.sort((a, b) => {
      return idsCounter[b] - idsCounter[a];
    });
    // get top 5 after sorting
    const topFive = keys.slice(0, 5);
    const topFiveWithCount = topFive.map((id) => {
      return {
        id,
        count: idsCounter[id],
      };
    });
    topFivePerMonth.push({ fullDate: date, topFive: [...topFiveWithCount] });
    //now i have the date and the top five listing ids contacted
    // [date, topfive:[{id,count}]]
  });
  const hashListingData = {};
  // [key:listing_id]:{
  //    fulldate,
  //    topFive:recordsArray
  // }
  listingsCSV.map((record) => {
    hashListingData[record[0]] = record;
  });

  const topFivePerMonthRecords = topFivePerMonth.map((eachMonth) => {
    //get the records based on the top 5 ids from the hashed Listing data
    const recordsArray = eachMonth.topFive.map((idWithCount) => {
      return [...hashListingData[idWithCount.id], idWithCount.count];
    });
    return {
      fullDate: eachMonth.fullDate,
      topFive: [...recordsArray],
    };
  });
  res.send({ message: 'The Average listing', topFivePerMonthRecords });
});

module.exports = router;
