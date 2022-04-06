const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
    "369733052009-g00h8602jrflnkm2fje67t9sfle26o8m.apps.googleusercontent.com",
    "xKs2nQl5wdkmvGpGjjVmEWhO",
    "urn:ietf:wg:oauth:2.0:oob"
);

oAuth2Client.setCredentials({
    access_token:"ya29.a0AfH6SMCcLIHHBT9CrD9IgcEkG4wXuhguuqIFpYLzxbR743VjUKxMIw5vbGmivYtVKR1QUG2echpXvEkvYAqoLakLtgkq312WSQ7U_yuksvZP6ytiUqBwgXDVCePiNyysSMT01ypMGpwD5Cu8AoWUuUzT23Lu",
    refresh_token:"1//01sj94WYPoWNhCgYIARAAGAESNwF-L9IrvTHi-qZmH17tq6r9UMokVh7yXfHVVqvLiM5TT9CwaBJpCirfaDGelfSbKVozth4i4uA",
    scope:"https://www.googleapis.com/auth/spreadsheets",
    token_type:"Bearer",
    expiry_date:1618772246142,
});

const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

async function read() {
  const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1egsS3ocK2lvu6qkoVQy6iNZlyXmZZHxwhyLZIcmkjm4",
      range: "Products!A2:E",
});
  
  const rows = response.data.values;
  const products = rows.map((row) => ({
    id: +row[0],
    name: row[1],
    price: +row[2],
    image: row[3],
    stock: +row[4],
  }));

  return products;
}

async function write(products) {
  let values = products.map((p) => [p.id, p.name, p.price, p.image, p.stock]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1egsS3ocK2lvu6qkoVQy6iNZlyXmZZHxwhyLZIcmkjm4",
    range: "Products!A2:E",
    valueInputOption: "RAW",
    resource,
  });

  console.log(result.updatedCells);
}

// async function readAndWrite() {
//   const products = await read();
//   products[0].stock = 20;
//   await write(products);
// }

// readAndWrite();

module.exports = {
  read,
  write,
};