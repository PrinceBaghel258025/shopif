import { DeliveryMethod } from "@shopify/shopify-api";
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
const crmUrl = "https://g9bvvvyptqo7uxa0.agspert-ai.com/";
import { makeRequest } from './utils.js';

const DB_PATH = `${process.cwd()}/database.sqlite`;
const crmCallback = async (topic, shop, body, webhookId) => {
  const db = new sqlite3.Database(DB_PATH);
  let token = await new Promise((resolve, reject) => {
    db.get("SELECT token FROM token_shop_mapping WHERE shop_id = ?", [shop], (err, row) => {
      if (err) reject(err);
      console.log("row", row, shop);
      resolve(row?.token);
    });
  });
  console.log("token", token);
  // if (!token) {
  //   const shopData = await new Promise((resolve, reject) => {
  //     db.get("SELECT * FROM shopify_sessions WHERE shop = ?", ["quickstart-2997e1c9.myshopify.com"], (err, row) => {
  //       // db.get("SELECT * FROM shopif_sessions WHERE shop = ?", [shop], (err, row) => {
  //       if (err) reject(err);
  //       resolve(row);
  //     });
  //   });
  //   console.log("shopData", shopData);
  //   console.log("No token found for shop", shop, shopData);
  //   return;
  // }
  const url = `${crmUrl}kvk/product/event_management/`;
  const payload = {
    data: {
      topic,
      shop,
      body: JSON.parse(body),
      webhookId
    }
  }

  const data = await makeRequest(url, "POST", `Token ${token}`, payload);
  console.log("crmCallResponse", token, data);
  return data;
};
/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      try {
        const user_detailUrl = `${crmUrl}shopify/user_detail?shop=${shop}`;
        const token = await new Promise((resolve, reject) => {
          db.get("SELECT token FROM token_shop_mapping WHERE shop_id = ?", [shop], (err, row) => {
            if (err) reject(err);
            resolve(row?.token);
          });
        });
        const data = await makeRequest(user_detailUrl, "GET", `Token ${token}`);
        console.log("crm response", data);
        return data;
      } catch (e) {
        return {
          status: "ok",
          message: e.message
        }
      }

    },
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("CUSTOMERS_REDACT", payload);
      return {
        status: "ok",
        message: "success"
      }
    },
  },
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("SHOP_REDACT", payload);
      return {
        status: "ok",
        message: "success"
      }
    },
  },
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("PRODUCTS_CREATE", shop, payload);
      try {

        const data = await crmCallback(topic, shop, body, webhookId);
        console.log("crm response", data);
      } catch (e) {
        console.log("error in crm callback", e);
      }
      console.log("CRM Callback done", "product create, shop", shop);
    },
  },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      try {
        const data = await crmCallback(topic, shop, body, webhookId);
        console.log("crm response", data);
      } catch (e) {
        console.log("error in crm callback", e);
      }
      console.log("CRM Callback done", "product update");
    },
  },
  PRODUCTS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      try {
        const data = await crmCallback(topic, shop, body, webhookId);
        console.log("crm response", data);
      } catch (e) {
        console.log("error in crm callback", e);
      }
      console.log("CRM Callback done", "product delete");
    },
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("APP_UNINSTALLED", payload);
      try {
        const data = await crmCallback(topic, shop, body, webhookId);
        console.log("crm response", data);
      } catch (e) {
        console.log("error in crm callback", e);
      }

      console.log("CRM Callback done", "app uninstalled");
    },
  },
};
