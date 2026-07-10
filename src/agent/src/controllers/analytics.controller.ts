import { Request, Response } from "express";
import { AdbService } from "../services/adb.service";
import {QualityService} from "../services/Quality.service";

const adb = new AdbService();
const quality = new QualityService();
export class AnalyticsController {

    async meminfo(req: Request, res: Response) {
        try {
            res.json(await adb.meminfo());
        } catch (err) {
            res.status(500).json({ error: "Falha ao ler meminfo", details: String(err) });
        }
    }

    async gfxinfo(req: Request, res: Response) {
        try {
            res.json(await adb.gfxinfo());
        } catch (err) {
            res.status(500).json({ error: "Falha ao ler gfxinfo", details: String(err) });
        }
    }

    async cpu(req: Request, res: Response) {
        try {
            res.json(await adb.cpu());
        } catch (err) {
            res.status(500).json({ error: "Falha ao ler cpuinfo", details: String(err) });
        }
    }

    async battery(req: Request, res: Response) {
        try {
            res.json(await adb.battery());
        } catch (err) {
            res.status(500).json({ error: "Falha ao ler battery", details: String(err) });
        }
    }

    async pid(req: Request, res: Response) {
        try {
            res.json(await adb.pid());
        } catch (err) {
            res.status(500).json({ error: "Falha ao ler pid", details: String(err) });
        }
    }

    async quality(req: Request, res: Response) {
        try {
            res.json(await quality.getQuality());
        } catch (err) {
            res.status(500).json({ error: "Falha ao calcular quality", details: String(err) });
        }
    }
    async network (req: Request, res: Response){
        try {
            const data = await adb.network();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Falha ao calcular quality", details: String(err) });
        }
    }

    async appInfo(req: Request, res: Response) {
        try{
            const data = await adb.appInfo();
            res.json(data);
        }catch (err){
            res.status(500).json({ error: "Falha ao carregar informação do pacote", details: String(err) });

        }
    }
}