import express from "express";
import dotenv from "dotenv";
import { Shopify } from "@shopify/shopify-api";

dotenv.config();

const app = express();
const port = 3000;

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES } = process.env;

const shops = {};

Shopify.Context.initialize(
    {
        API_KEY: SHOPIFY_API_KEY,
        API_SECRET_KEY: SHOPIFY_API_SECRET,
        SCOPES: [SHOPIFY_API_SCOPES],
        HOST_NAME:"a031-2402-8100-263e-8151-c170-b6ab-8821-9acf.ngrok.io",
        IS_EMBEDDED_APP: true,
    }
)
app.get('/', async (req, res) => {
    if (typeof shops[req.query.shop] !== "undefined") {
        res.send("hllo world");
    }
    else {
        res.redirect(`/auth?shop=${req.query.shop}`);
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
        req.query
    );
    console.log(shopSession);
    shops[shopSession.shop] = shopSession;
    console.log(shops);
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})