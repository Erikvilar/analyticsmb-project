import {Router} from "express";

import {AnalyticsController} from "../controllers/analytics.controller";

    const r=Router();

    const c=new AnalyticsController();


    r.get("/meminfo", (req, res) => c.meminfo(req, res));
    r.get("/gfxinfo", (req, res) => c.gfxinfo(req, res));
    r.get("/quality", (req, res) => c.quality(req, res));
    r.get('/network', (req, res) => c.network(req, res))
    r.get('/pid', (req, res) => c.pid(req, res))
    r.get('/cpuinfo', (req, res) => c.cpu(req, res))
    r.get('/battery', (req, res) => c.battery(req, res))


    export default r;