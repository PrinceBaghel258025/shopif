import { DeliveryMethod } from "@shopify/shopify-api";
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const DB_PATH = `${process.cwd()}/database.sqlite`;
const crmCallback = async (topic, shop, body, webhookId) => {
  const db = new sqlite3.Database(DB_PATH);
  const token = await new Promise((resolve, reject) => {
    db.get("SELECT token FROM token_shop_mapping WHERE shop_id = ?", [shop], (err, row) => {
      if (err) reject(err);
      console.log("row", row, shop);
      resolve(row?.token);
    });
  });
  console.log("token", token);
  if (!token) {
    const shopData = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM shopify_sessions WHERE shop = ?", ["quickstart-2997e1c9.myshopify.com"], (err, row) => {
        // db.get("SELECT * FROM shopif_sessions WHERE shop = ?", [shop], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    console.log("shopData", shopData);
    console.log("No token found for shop", shop, shopData);
    return;
  }
  const url = "https://g9bvvvyptqo7uxa0.agspert-ai.com//kvk/product/event_management";


  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    method: "POST",
    body: JSON.stringify({
      topic,
      shop,
      body,
      webhookId
    }),
  });
};
/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {

      const payload = JSON.parse(body);

    },
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("PRODUCTS_CREATE", shop, payload);
      crmCallback(topic, shop, body, webhookId);
      console.log("CRM Callback done", "product create, shop", shop);
      const data = {
        topic,
        shop,
        body: payload,
        webhookId
      };

      const filePath = path.join('product_create_data.json');

      fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log('Product create data saved successfully');
        }
      });
    },
  },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      crmCallback(topic, shop, body, webhookId);
      console.log("CRM Callback done", "product update");
      const data = {
        topic,
        shop,
        body: payload,
        webhookId
      };

      const filePath = path.join('product_update_data.json');

      fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log('Product update data saved successfully');
        }
      });
    },
  },
  PRODUCTS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      crmCallback(topic, shop, body, webhookId);
      console.log("CRM Callback done", "product delete");

      const data = {
        topic,
        shop,
        body: payload,
        webhookId
      };

      const filePath = path.join('webhook_data.json');

      fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log('Webhook data saved successfully');
        }
      });
    },
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("APP_UNINSTALLED", payload);
      crmCallback(topic, shop, body, webhookId);
      console.log("CRM Callback done", "app uninstalled");
      const data = {
        topic,
        shop,
        body: payload,
        webhookId
      };

      const filePath = path.join('shop_uninstalled.json');

      fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log('Shop uninstalled data saved successfully');
        }
      });
    },
  },
};
