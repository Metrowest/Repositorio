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
      range: "Products!A2:F",
    });
  
    const rows = response.data.values;
    const products = rows.map((row) => ({
      id: +row[0],
      name: row[1],
      price: +row[2],
      image: row[3],
      stock: +row[4],
      category: row[5],
    }));
  
    return products;
  }
  
  async function write(products) {
    let values = products.map((p) => [p.id, p.name, p.price, p.image, p.stock, p.category]);
  
    const resource = {
      values,
    };
    const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1egsS3ocK2lvu6qkoVQy6iNZlyXmZZHxwhyLZIcmkjm4",
    range: "Products!A2:F",
    valueInputOption: "RAW",
    resource,
  });
}

async function writeOrders(orders) {
  let values = orders.map((order) => [
    order.date,
    order.preferenceId,
    order.shipping.name,
    order.shipping.email,
    JSON.stringify(order.items),
    JSON.stringify(order.shipping),
    order.status,
  ]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1egsS3ocK2lvu6qkoVQy6iNZlyXmZZHxwhyLZIcmkjm4",
    spreadsheetId: "1egsS3ocK2lvu6qkoVQy6iNZlyXmZZHxwhyLZIcmkjm4",
    range: "Orders!A2:G",
    valueInputOption: "RAW",
    resource,
  });
}

async function readOrders() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1egsS3ocK2lvu6qkoVQy6iNZlyXmZZHxwhyLZIcmkjm4",
    range: "Orders!A2:G",
  });

  const rows = response.data.values || [];
  const orders = rows.map((row) => ({
    date: row[0],
    preferenceId: row[1],
    name: row[2],
    email: row[3],
    items: JSON.parse(row[4]),
    shipping: JSON.parse(row[5]),
    status: row[6],
  }));

  return orders;
}

async function updateOrderByPreferenceId(preferenceId, status) {
  const orders = await readOrders();
  const order = orders.find(o => o.preferenceId === preferenceId)
  order.status = status;
  await writeOrders(orders);
}

module.exports = {
  read,
  write,
  writeOrders,
  updateOrderByPreferenceId,
  readOrders,
};