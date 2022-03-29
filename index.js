import express from "express";
import dotenv from "dotenv";
import { Shopify } from "@shopify/shopify-api";

dotenv.config();

//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
const app = express();
const port = 3000;

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES } = process.env;

const shops = {};

Shopify.Context.initialize(
    {
        API_KEY: SHOPIFY_API_KEY,
        API_SECRET_KEY: SHOPIFY_API_SECRET,
        SCOPES: SHOPIFY_API_SCOPES,
        HOST_NAME:"5490-2402-8100-263c-40ed-25bf-c8a5-125f-4866.ngrok.io",
        IS_EMBEDDED_APP: true,
    }
)
app.get('/', async (req, res) => {
    if (typeof shops[req.query.shop] !== "undefined") {
        res.send("hllo world");
    }
    else {
        res.redirect(`/auth?shop=brotherauth.myshopify.com`);
    }
});

app.get("/auth", async (req, res) => {
    const authRoute = await Shopify.Auth.beginAuth(
        req,
        res,
        req.query.shop,
        '/auth/callback',
        false,
    )
    res.redirect(authRoute);
});

app.get("/auth/callback", async (req, res) => {
    const shopSession = Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query,
    );
    const data = (await shopSession).shop;
    const token = (await shopSession).accessToken;
    shops[data] = shopSession;
    const makeRequest = await fetch("https://brotherauth.myshopify.com/admin/api/2021-07/products.json".{
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token':token,
        }
    });
    const data = await makeRequest.json();
    res.send(data.products);
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})