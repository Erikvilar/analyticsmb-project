import {Router} from "express";

import {AnalyticsController} from "../controllers/analytics.controller";

    const r=Router();

    const c=new AnalyticsController();


    r.get("/meminfo", (req, res) => c.meminfo(req, res));
    r.get("/gfxinfo", (req, res) => c.gfxinfo(req, res));
    r.get("/qualityinfo", (req, res) => c.quality(req, res));
    r.get('/networkinfo', (req, res) => c.network(req, res))
    r.get('/pidinfo', (req, res) => c.pid(req, res))
    r.get('/cpuinfo', (req, res) => c.cpu(req, res))
    r.get('/batteryinfo', (req, res) => c.battery(req, res))
    r.get('/appinfo', (req, res) => c.appInfo(req, res))


    export default r;